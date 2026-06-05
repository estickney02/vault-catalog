import Link          from 'next/link'
import Marquee       from '@/components/Marquee'
import ProductCard   from '@/components/ProductCard'
import HeroCarousel  from '@/components/HeroCarousel'
import HowItWorks    from '@/components/HowItWorks'
import CategoryGrid  from '@/components/CategoryGrid'
import BrandGrid     from '@/components/BrandGrid'
import { readJson }  from '@/lib/blobDb'

export const revalidate = 0

export default async function HomePage() {
  const all        = await readJson('products', [])
  const sorted     = [...all].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  const featured   = all.filter(p => p.featured).slice(0, 8)
  const newArrivals = sorted.slice(0, 8)

  return (
    <div>
      {/* ── HERO CAROUSEL ───────────────────────── */}
      <HeroCarousel products={featured.length ? featured : newArrivals.slice(0,6)} />

      {/* ── MARQUEE DIVIDER ─────────────────────── */}
      <Marquee />

      {/* ── NEW ARRIVALS ────────────────────────── */}
      <section className="bg-emf-ivory py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-eyebrow mb-2">Just Dropped</p>
              <h2 className="font-script text-5xl md:text-6xl text-emf-black leading-none">New Arrivals</h2>
            </div>
            <Link href="/shop" className="font-display text-xs tracking-[0.2em] uppercase text-emf-muted hover:text-emf-pink-dk transition-colors hidden sm:block">
              View All →
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-emf-muted font-display text-sm tracking-widest uppercase">
              No products yet — add some from the admin dashboard.
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/shop" className="btn-outline">View All Finds</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────── */}
      <HowItWorks />

      {/* ── CATEGORIES ──────────────────────────── */}
      <CategoryGrid />

      {/* ── BRANDS ──────────────────────────────── */}
      <BrandGrid />
    </div>
  )
}
