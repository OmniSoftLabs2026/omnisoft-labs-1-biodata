import { NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { razorpay } from '@/lib/razorpay'
import clientPromise from '@/lib/db'

export const runtime = 'nodejs'

const AMOUNT_PAISE = 7900 // ₹79
const CURRENCY = 'INR'
const DB_NAME = process.env.DB_NAME || 'biodatacraft'

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { template } = body

    const receipt = `rcpt_${crypto.randomUUID().replaceAll('-', '').slice(0, 32)}`

    const order = await razorpay.orders.create({
      amount: AMOUNT_PAISE,
      currency: CURRENCY,
      receipt,
      notes: { template: template || 'Ivory Cream' },
      payment_capture: 1,
    })

    const client = await clientPromise
    const db = client.db(DB_NAME)

    await db.collection('orders').insertOne({
      razorpayOrderId: order.id,
      receipt,
      template: template || 'Ivory Cream',
      amount: AMOUNT_PAISE,
      currency: CURRENCY,
      status: 'created',
      createdAt: new Date(),
    })

    return NextResponse.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: AMOUNT_PAISE,
      currency: CURRENCY,
    })
  } catch (error) {
    console.error('Order creation failed:', error?.message || error)
    return NextResponse.json(
      { error: 'Unable to create order. Please try again.' },
      { status: 500 }
    )
  }
}
