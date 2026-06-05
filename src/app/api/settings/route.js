import { NextResponse } from 'next/server'
import fs   from 'fs'
import path from 'path'

const DB = path.join(process.cwd(), 'data/settings.json')

const read  = () => { try { return JSON.parse(fs.readFileSync(DB,'utf8')) } catch { return {} } }
const write = (d) => fs.writeFileSync(DB, JSON.stringify(d,null,2),'utf8')
const auth  = (req) => req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN||'vault_session_abc123')

export async function GET() {
  return NextResponse.json(read())
}

export async function PUT(req) {
  if (!auth(req)) return NextResponse.json({error:'Unauthorized'},{status:401})
  const body     = await req.json()
  const settings = { ...read(), ...body }
  write(settings)
  return NextResponse.json(settings)
}
