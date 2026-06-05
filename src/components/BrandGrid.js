import Link  from 'next/link'
import Image from 'next/image'
import { readJson } from '@/lib/blobDb'

export default async function BrandGrid() {
  const all    = await readJson('brands', [])
  const brands = all.filter(b => b.active)
  if (!brands.length) return null

  return (
    <section className="bg-emf-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">By Brand</p>
          <h2 className="font-script text-5xl md:text-6xl text-emf-black leading-none">Shop by Brand</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="group relative aspect-[4/3] overflow-hidden bg-emf-black hover:bg-zinc-900 shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300"
            >
              {brand.image && (
                <Image src={brand.image} alt={brand.name} fill sizes="(max-width:640px) 50vw,25vw" className="object-cover opacity-30 group-hover:opacity-20 transition-opacity duration-500" />
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-4 text-center">
                <p className="font-display font-semibold text-sm md:text-base tracking-[0.18em] uppercase text-emf-pink group-hover:text-emf-pink-lt transition-colors">
                  {brand.name}
                </p>
                {brand.description && (
                  <p className="font-display text-[10px] tracking-widest uppercase text-emf-pink/50">
                    {brand.description}
                  </p>
                )}
                <div className="mt-1 w-6 h-px bg-emf-pink/40 group-hover:w-12 group-hover:bg-emf-pink transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
