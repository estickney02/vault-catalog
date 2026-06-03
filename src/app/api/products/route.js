import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

const DB_PATH = path.join(process.cwd(), 'data/products.json')

function readProducts() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

function writeProducts(products) {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf8')
}

function verifyAdmin(request) {
  const token = request.headers.get('x-admin-token')
  const validToken = process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123'
  return token === validToken
}

export async function GET() {
  const products = readProducts()
  const sorted = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const products = readProducts()

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
    writeProducts(products)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
