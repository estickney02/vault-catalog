import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { readJson, writeJson } from '@/lib/blobDb'

function verifyAdmin(request) {
  const token = request.headers.get('x-admin-token')
  const validToken = process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123'
  return token === validToken
}

export async function GET() {
  const products = await readJson('products', [])
  const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const products = await readJson('products', [])

    const newProduct = {
      id: uuidv4(),
      name: body.name || '',
      brand: body.brand || '',
      type: body.type || '',
      description: body.description || '',
      link: body.link || '',
      images: body.images || [],
      featured: body.featured || false,
      createdAt: new Date().toISOString(),
    }

    products.push(newProduct)
    await writeJson('products', products)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (err) {
    console.error('POST /api/products error:', err)
    return NextResponse.json({ error: 'Failed to create product: ' + err.message }, { status: 500 })
  }
}
