import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { password } = await request.json()
    const correctPassword = process.env.ADMIN_PASSWORD || 'VAULT_ADMIN_2024!'
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123'

    if (password !== correctPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({ token: sessionToken })
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
