import { NextResponse } from 'next/server'
import { v4 as uuidv4 }  from 'uuid'
import { readJson, writeJson } from '@/lib/blobDb'

function verifyAdmin(req) {
  return req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123')
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : body.items

    if (!items || !items.length) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const products = await readJson('products', [])

    const newProducts = items.map(item => ({
      id:          uuidv4(),
      name:        item.name        || '',
      brand:       item.brand       || '',
      type:        item.type        || '',
      price:       item.price       || '',
      description: item.description || '',
      link:        item.link        || '',
      images:      item.images      || [],
      featured:    item.featured    || false,
      createdAt:   new Date().toISOString(),
    }))

    products.push(...newProducts)
    await writeJson('products', products)

    return NextResponse.json({ success: newProducts.length, ids: newProducts.map(p => p.id) }, { status: 201 })
  } catch (err) {
    console.error('Bulk import error:', err)
    return NextResponse.json({ error: 'Bulk import failed: ' + err.message }, { status: 500 })
  }
}
