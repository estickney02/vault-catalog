import Link  from 'next/link'
import Image from 'next/image'
import fs    from 'fs'
import path  from 'path'

function getBrands() {
  try {
    const brands = JSON.parse(fs.readFileSync(path.join(process.cwd(),'data/brands.json'),'utf8'))
    return brands.filter(b => b.active)
  } catch { return [] }
}

const BG_COLORS = [
  'bg-rose-100', 'bg-stone-200', 'bg-sky-100', 'bg-emerald-100',
  'bg-purple-100', 'bg-amber-100', 'bg-indigo-100', 'bg-pink-100',
]

export default function BrandGrid() {
  const brands = getBrands()
  if (!brands.length) return null

  return (
    <section className="bg-emf-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">By Brand</p>
          <h2 className="font-script text-5xl md:text-6xl text-emf-black leading-none">Shop by Brand</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className={`group relative aspect-[4/3] overflow-hidden ${brand.image ? '' : BG_COLORS[i % BG_COLORS.length]} shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300`}
            >
              {brand.image ? (
                <Image src={brand.image} alt={brand.name} fill sizes="(max-width:640px) 50vw,25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : null}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center">
                <p className="font-display font-bold text-sm md:text-base tracking-[0.15em] uppercase text-white drop-shadow">
                  {brand.name}
                </p>
                {brand.description && (
                  <p className="font-display text-[10px] tracking-widest uppercase text-white/70">
                    {brand.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
