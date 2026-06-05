'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link  from 'next/link'

export default function HeroCarousel({ products }) {
  const [current, setCurrent]   = useState(0)
  const [paused,  setPaused]    = useState(false)
  const total = products.length

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])

  useEffect(() => {
    if (paused || total <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [paused, total, next])

  if (!products || total === 0) return null

  return (
    <div
      className="relative w-full overflow-hidden bg-emf-surface"
      style={{ height: 'clamp(340px, 55vw, 600px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {products.map((p, i) => {
        const hasImage = p.images && p.images.length > 0
        return (
          <div
            key={p.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Image */}
            <div className="absolute inset-0">
              {hasImage ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority={i === 0}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emf-pink-lt via-emf-ivory to-emf-surface" />
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 z-10">
              <div className="max-w-xl">
                {p.brand && (
                  <span className="pill-pink mb-3 inline-block">{p.brand}</span>
                )}
                <h3 className="font-script text-3xl md:text-5xl text-white mb-4 leading-tight">{p.name}</h3>
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-pink inline-block"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>
        )
      })}

      {/* Prev arrow */}
      {total > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors"
          aria-label="Previous"
        >
          <span className="text-emf-black text-lg">‹</span>
        </button>
      )}

      {/* Next arrow */}
      {total > 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors"
          aria-label="Next"
        >
          <span className="text-emf-black text-lg">›</span>
        </button>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-emf-pink' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
