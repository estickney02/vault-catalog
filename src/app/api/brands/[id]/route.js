import { NextResponse } from 'next/server'
import fs   from 'fs'
import path from 'path'

const DB = path.join(process.cwd(), 'data/brands.json')

const read  = () => { try { return JSON.parse(fs.readFileSync(DB,'utf8')) } catch { return [] } }
const write = (d) => fs.writeFileSync(DB, JSON.stringify(d,null,2),'utf8')
const auth  = (req) => req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN||'vault_session_abc123')

export async function PUT(req, {params}) {
  if (!auth(req)) return NextResponse.json({error:'Unauthorized'},{status:401})
  const body   = await req.json()
  const brands = read()
  const idx    = brands.findIndex(b => b.id === params.id)
  if (idx === -1) return NextResponse.json({error:'Not found'},{status:404})
  brands[idx]  = { ...brands[idx], ...body }
  write(brands)
  return NextResponse.json(brands[idx])
}

export async function DELETE(req, {params}) {
  if (!auth(req)) return NextResponse.json({error:'Unauthorized'},{status:401})
  const brands   = read()
  const filtered = brands.filter(b => b.id !== params.id)
  if (filtered.length === brands.length) return NextResponse.json({error:'Not found'},{status:404})
  write(filtered)
  return NextResponse.json({success:true})
}
