import Link from 'next/link'
import { CLOTHING_TYPES } from '@/config'

// Gradient placeholder colours per category
const GRADIENTS = [
  'from-rose-100 to-pink-200',
  'from-stone-100 to-amber-100',
  'from-sky-100 to-indigo-100',
  'from-emerald-100 to-teal-100',
  'from-orange-100 to-red-100',
  'from-purple-100 to-pink-100',
  'from-yellow-100 to-orange-100',
  'from-blue-100 to-cyan-100',
  'from-fuchsia-100 to-rose-100',
]

export default function CategoryGrid() {
  return (
    <section id="categories" className="bg-emf-ivory py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Browse</p>
          <h2 className="font-script text-5xl md:text-6xl text-emf-black leading-none">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CLOTHING_TYPES.map((cat, i) => (
            <Link
              key={cat}
              href={`/shop?type=${encodeURIComponent(cat)}`}
              className={`group relative aspect-square overflow-hidden bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} hover:scale-[1.02] transition-transform duration-300 shadow-card hover:shadow-card-hover`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-4">
                <div>
                  <p className="font-display font-bold text-sm tracking-[0.15em] uppercase text-emf-black group-hover:text-emf-black transition-colors">
                    {cat}
                  </p>
                  <div className="mt-1 w-6 h-0.5 bg-emf-pink group-hover:w-10 transition-all duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
