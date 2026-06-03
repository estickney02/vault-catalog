import { notFound } from 'next/navigation'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import ImageCarousel from '@/components/ImageCarousel'

async function getProduct(id) {
  try {
    const filePath = path.join(process.cwd(), 'data/products.json')
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return products.find((p) => p.id === id) || null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id)
  if (!product) return { title: 'Not Found — VAULTED' }
  return {
    title: `${product.name} — VAULTED`,
    description: product.description,
  }
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  if (!product) notFound()

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-v-muted hover:text-v-gold transition-colors mb-10"
        >
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image carousel */}
          <div>
            <ImageCarousel images={product.images} alt={product.name} />
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand && (
                <span className="text-[11px] tracking-[0.2em] uppercase text-v-gold border border-v-gold/40 px-3 py-1">
                  {product.brand}
                </span>
              )}
              {product.type && (
                <span className="text-[11px] tracking-[0.2em] uppercase text-v-muted border border-v-border px-3 py-1">
                  {product.type}
                </span>
              )}
              {product.featured && (
                <span className="text-[11px] tracking-[0.2em] uppercase bg-v-gold text-v-black px-3 py-1 font-semibold">
                  Featured
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Divider */}
            <div className="w-12 h-px bg-v-gold" />

            {/* Description */}
            {product.description && (
              <p className="text-v-muted leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
            )}

            {/* CTA */}
            <div className="pt-4">
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-block text-center w-full sm:w-auto sm:px-12"
              >
                Shop on KakoBuy
              </a>
              <p className="mt-3 text-[11px] text-v-muted tracking-wide">
                Opens in a new tab. Affiliate link — we may earn a commission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
