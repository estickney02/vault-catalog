import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import Marquee from '@/components/Marquee'
import ProductCard from '@/components/ProductCard'
import RegisterSection from '@/components/RegisterSection'
import { KAKOBUY_REGISTER_URL } from '@/config'

const CATEGORIES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Bags',
  'Shoes',
  'Accessories',
  'Jewelry',
]

async function getProducts() {
  try {
    const filePath = path.join(process.cwd(), 'data/products.json')
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const allProducts = await getProducts()
  const sorted = [...allProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const newArrivals = sorted.slice(0, 6)
  const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))]

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#f5f5f5 1px, transparent 1px), linear-gradient(90deg, #f5f5f5 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Gold accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-v-gold/60" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          <p className="section-label">Est. 2024</p>

          <h1 className="text-[clamp(4rem,15vw,10rem)] font-bold tracking-[0.15em] leading-none text-v-text">
            VAULTED
          </h1>

          <p className="text-v-muted text-lg md:text-xl tracking-widest font-light uppercase">
            The vault is open.
          </p>

          <p className="text-v-muted/60 text-sm max-w-sm leading-relaxed mt-2">
            Hand-selected designer reps and quality finds — every piece reviewed before it makes the
            cut.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/shop" className="btn-gold">
              Shop the Catalog
            </Link>
            <a
              href={KAKOBUY_REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold text-center"
            >
              Register on KakoBuy
            </a>
          </div>
          <p className="text-v-muted/50 text-xs mt-2 tracking-wide">
            New to KakoBuy? Register free through our link to support VAULTED.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-v-black to-transparent" />
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Register CTA — primary revenue driver */}
      <RegisterSection />

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">Just Dropped</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">New Arrivals</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm tracking-widest uppercase link-gold hidden sm:block"
          >
            View All →
          </Link>
        </div>

        {newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-v-border">
            {newArrivals.map((product) => (
              <div key={product.id} className="bg-v-black">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-v-muted">
            <p className="text-sm tracking-widest uppercase">No products yet</p>
            <p className="mt-2 text-xs">Add products in the admin dashboard.</p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="btn-outline-gold inline-block">
            View All
          </Link>
        </div>
      </section>

      {/* Category tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mb-12">
          <p className="section-label mb-2">Browse by Category</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Type</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-v-border">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?type=${encodeURIComponent(cat)}`}
              className="group relative bg-v-surface aspect-square flex items-center justify-center hover:bg-v-gold/5 transition-colors duration-300"
            >
              <div className="text-center">
                <p className="text-sm font-semibold tracking-[0.2em] uppercase text-v-text group-hover:text-v-gold transition-colors duration-200">
                  {cat}
                </p>
                <div className="mt-2 w-6 h-px bg-v-gold/30 mx-auto group-hover:bg-v-gold group-hover:w-10 transition-all duration-300" />
              </div>
              <div className="absolute inset-0 border border-transparent group-hover:border-v-gold/20 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* Brand tiles */}
      {brands.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mb-12">
            <p className="section-label mb-2">Browse by Brand</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Brands</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/shop?brand=${encodeURIComponent(brand)}`}
                className="group border border-v-border hover:border-v-gold px-5 py-3 text-sm tracking-[0.15em] uppercase text-v-muted hover:text-v-gold transition-all duration-200"
              >
                {brand}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
