import { NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { readJson, writeJson } from '@/lib/blobDb'

const auth = (req) => req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123')

export async function GET() {
  return NextResponse.json(await readJson('brands', []))
}

export async function POST(req) {
  if (!auth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body   = await req.json()
  const brands = await readJson('brands', [])
  const brand  = { id: uuid(), name: body.name || '', description: body.description || '', image: body.image || '', active: body.active ?? true }
  brands.push(brand)
  await writeJson('brands', brands)
  return NextResponse.json(brand, { status: 201 })
}
