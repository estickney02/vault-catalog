import { notFound } from 'next/navigation'
import Link           from 'next/link'
import fs             from 'fs'
import path           from 'path'
import ImageCarousel  from '@/components/ImageCarousel'

function getProduct(id) {
  try {
    const all = JSON.parse(fs.readFileSync(path.join(process.cwd(),'data/products.json'),'utf8'))
    return all.find(p => p.id === id) || null
  } catch { return null }
}

export async function generateMetadata({ params }) {
  const p = getProduct(params.id)
  if (!p) return { title: 'Not Found — EMONEY FINDS' }
  return { title: `${p.name} — EMONEY FINDS`, description: p.description }
}

export default function ProductPage({ params }) {
  const product = getProduct(params.id)
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-emf-ivory">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Back */}
        <Link href="/shop" className="inline-flex items-center gap-2 font-display text-xs tracking-[0.2em] uppercase text-emf-muted hover:text-emf-pink-dk transition-colors mb-10">
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <ImageCarousel images={product.images} alt={product.name} />

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.brand && <span className="pill-pink">{product.brand}</span>}
              {product.type  && <span className="pill-gray">{product.type}</span>}
              {product.featured && <span className="pill-pink">Featured</span>}
            </div>

            {/* Name */}
            <h1 className="font-script text-4xl md:text-5xl text-emf-black leading-tight">{product.name}</h1>

            {/* Divider */}
            <div className="w-16 h-0.5 bg-emf-pink" />

            {/* Description */}
            {product.description && (
              <p className="font-display text-emf-muted text-sm leading-relaxed">{product.description}</p>
            )}

            {/* CTA */}
            <div className="pt-4">
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-black inline-block text-center w-full sm:w-auto sm:px-14"
              >
                Shop on KakoBuy →
              </a>
              <p className="font-display text-emf-muted/50 text-xs mt-3">
                Opens in a new tab. Affiliate link — we may earn a commission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
