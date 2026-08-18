import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const path = params?.path?.join('/') || ''
  return NextResponse.json({ ok: true, path, message: 'BiodataCraft API is up.' })
}

export async function POST(request, { params }) {
  const path = params?.path?.join('/') || ''
  try {
    const body = await request.json().catch(() => ({}))
    return NextResponse.json({ ok: true, path, received: body })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }
}
