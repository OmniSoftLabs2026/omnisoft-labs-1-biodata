import { NextResponse } from 'next/server'
import clientPromise from '@/lib/db'

export const runtime = 'nodejs'

const DB_NAME = process.env.DB_NAME || 'biodatacraft'

export async function POST(request) {
  try {
    const { downloadToken } = await request.json()
    if (!downloadToken) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db(DB_NAME)
    const order = await db.collection('orders').findOne({ downloadToken, status: 'paid' })

    return NextResponse.json({ valid: !!order })
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 })
  }
}
