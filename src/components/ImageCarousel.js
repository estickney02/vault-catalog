'use client'

import { useState } from 'react'
import Image        from 'next/image'

export default function ImageCarousel({ images, alt }) {
  const [current, setCurrent] = useState(0)
  const has = images && images.length > 0

  if (!has) return (
    <div className="aspect-square w-full bg-gradient-to-br from-emf-pink-lt/40 to-emf-surface flex items-center justify-center">
      <span className="font-script text-3xl text-emf-pink/40">Emoney Finds</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Main */}
      <div className="relative aspect-square w-full overflow-hidden bg-emf-surface">
        <Image src={images[current]} alt={`${alt} ${current+1}`} fill sizes="(max-width:768px) 100vw,50vw" className="object-cover" priority />
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrent(c => c===0?images.length-1:c-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center shadow text-xl transition-colors">‹</button>
            <button onClick={() => setCurrent(c => c===images.length-1?0:c+1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white flex items-center justify-center shadow text-xl transition-colors">›</button>
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 font-display">{current+1}/{images.length}</span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-200 ${i===current?'ring-2 ring-emf-pink':'opacity-60 hover:opacity-100'}`}>
              <Image src={src} alt={`thumb ${i+1}`} fill sizes="64px" className="object-cover" loading="lazy"/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
