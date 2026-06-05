import Link from 'next/link'
import { CLOTHING_TYPES } from '@/config'

export default function CategoryGrid() {
  return (
    <section id="categories" className="bg-emf-ivory py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Browse</p>
          <h2 className="font-script text-5xl md:text-6xl text-emf-black leading-none">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CLOTHING_TYPES.map((cat) => (
            <Link
              key={cat}
              href={`/shop?type=${encodeURIComponent(cat)}`}
              className="group relative aspect-square overflow-hidden bg-emf-black hover:bg-zinc-900 transition-colors duration-300 shadow-card hover:shadow-card-hover"
            >
              <div className="absolute inset-0 flex items-end p-5">
                <div>
                  <p className="font-display font-semibold text-sm tracking-[0.18em] uppercase text-emf-pink group-hover:text-emf-pink-lt transition-colors">
                    {cat}
                  </p>
                  <div className="mt-1.5 w-6 h-px bg-emf-pink/40 group-hover:w-10 group-hover:bg-emf-pink transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
