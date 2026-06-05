import Link          from 'next/link'
import fs            from 'fs'
import path          from 'path'
import Marquee       from '@/components/Marquee'
import ProductCard   from '@/components/ProductCard'
import HeroCarousel  from '@/components/HeroCarousel'
import HowItWorks    from '@/components/HowItWorks'
import CategoryGrid  from '@/components/CategoryGrid'
import BrandGrid     from '@/components/BrandGrid'

function getProducts() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(),'data/products.json'),'utf8')) }
  catch { return [] }
}

export default function HomePage() {
  const all        = getProducts()
  const sorted     = [...all].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))
  const featured   = all.filter(p => p.featured).slice(0, 8)
  const newArrivals = sorted.slice(0, 8)

  return (
    <div>
      {/* ── HERO ────────────────────────────────── */}
      <section className="bg-emf-ivory pt-12 pb-0 px-4 text-center">
        <div className="max-w-4xl mx-auto mb-10">
          <p className="section-eyebrow mb-4">KakoBuy Curated</p>

          <h1 className="font-script leading-none text-emf-black mb-2" style={{fontSize:'clamp(3.5rem,10vw,7rem)'}}>
            The Finds.
          </h1>
          <h1 className="font-script leading-none text-emf-black mb-6" style={{fontSize:'clamp(3.5rem,10vw,7rem)'}}>
            Curated.
          </h1>

          <p className="font-display text-emf-muted text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
            Premium finds, organized so you can actually shop.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-black">Shop All Finds</Link>
            <Link href="/#how-it-works" className="btn-outline">How It Works</Link>
          </div>
        </div>

        {/* Carousel */}
        <HeroCarousel products={featured.length ? featured : newArrivals.slice(0,6)} />
      </section>

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
