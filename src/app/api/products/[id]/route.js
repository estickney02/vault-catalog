import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data/products.json')

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
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

export async function GET(request, { params }) {
  const products = readProducts()
  const product = products.find((p) => p.id === params.id)
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(request, { params }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const products = readProducts()
    const index = products.findIndex((p) => p.id === params.id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    products[index] = {
      ...products[index],
      name: body.name ?? products[index].name,
      brand: body.brand ?? products[index].brand,
      type: body.type ?? products[index].type,
      description: body.description ?? products[index].description,
      link: body.link ?? products[index].link,
      images: body.images ?? products[index].images,
      featured: body.featured ?? products[index].featured,
    }

    writeProducts(products)
    return NextResponse.json(products[index])
  } catch {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = readProducts()
  const filtered = products.filter((p) => p.id !== params.id)
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  writeProducts(filtered)
  return NextResponse.json({ success: true })
}
