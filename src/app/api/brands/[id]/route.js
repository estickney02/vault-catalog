import { NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/blobDb'

const auth = (req) => req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123')

export async function PUT(req, { params }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body   = await req.json()
  const brands = await readJson('brands', [])
  const idx    = brands.findIndex(b => b.id === params.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  brands[idx]  = { ...brands[idx], ...body }
  await writeJson('brands', brands)
  return NextResponse.json(brands[idx])
}

export async function DELETE(req, { params }) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const brands   = await readJson('brands', [])
  const filtered = brands.filter(b => b.id !== params.id)
  if (filtered.length === brands.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await writeJson('brands', filtered)
  return NextResponse.json({ success: true })
}
