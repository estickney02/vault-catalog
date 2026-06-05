import { NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/blobDb'

const auth = (req) => req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123')

const DEFAULTS = {
  kakobuyLink: 'https://ikako.vip/r/EMONEYFINDS',
  instagramUrl: '',
  tiktokUrl: '',
}

export async function GET() {
  const settings = await readJson('settings', DEFAULTS)
  return NextResponse.json({ ...DEFAULTS, ...settings })
}

export async function PUT(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body     = await req.json()
  const current  = await readJson('settings', DEFAULTS)
  const settings = { ...DEFAULTS, ...current, ...body }
  await writeJson('settings', settings)
  return NextResponse.json(settings)
}
