import { NextResponse } from 'next/server'
import { readJson, writeJson } from '@/lib/blobDb'

function verifyAdmin(request) {
  const token = request.headers.get('x-admin-token')
  const validToken = process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123'
  return token === validToken
}

export async function GET(request, { params }) {
  const products = await readJson('products', [])
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
    const products = await readJson('products', [])
    const index = products.findIndex((p) => p.id === params.id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    products[index] = {
      ...products[index],
      name: body.name ?? products[index].name,
      brand: body.brand ?? products[index].brand,
      type: body.type ?? products[index].type,
      price: body.price ?? products[index].price ?? '',
      description: body.description ?? products[index].description,
      link: body.link ?? products[index].link,
      images: body.images ?? products[index].images,
      featured: body.featured ?? products[index].featured,
    }

    await writeJson('products', products)
    return NextResponse.json(products[index])
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update product: ' + err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const products = await readJson('products', [])
  const filtered = products.filter((p) => p.id !== params.id)
  if (filtered.length === products.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  await writeJson('products', filtered)
  return NextResponse.json({ success: true })
}
