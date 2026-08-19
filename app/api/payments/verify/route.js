import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export const runtime = 'nodejs'

const DB_NAME = process.env.DB_NAME || 'biodatacraft'

function verifySignature(orderId, paymentId, receivedSig, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')

  const expBuf = Buffer.from(expected, 'hex')
  const rcvBuf = Buffer.from(receivedSig, 'hex')

  return (
    expBuf.length === rcvBuf.length &&
    crypto.timingSafeEqual(expBuf, rcvBuf)
  )
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 })
    }

    const client = await clientPromise
    const db = client.db(DB_NAME)
    const orders = db.collection('orders')

    const storedOrder = await orders.findOne({ razorpayOrderId: razorpay_order_id })
    if (!storedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const valid = verifySignature(
      storedOrder.razorpayOrderId,
      razorpay_payment_id,
      razorpay_signature,
      secret
    )

    if (!valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Generate a one-time download token
    const downloadToken = crypto.randomUUID()

    await orders.updateOne(
      { _id: storedOrder._id, status: { $ne: 'paid' } },
      {
        $set: {
          status: 'paid',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          downloadToken,
          verifiedAt: new Date(),
        },
      }
    )

    return NextResponse.json({ success: true, downloadToken })
  } catch (error) {
    console.error('Verification failed:', error?.message || error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
  }
}
