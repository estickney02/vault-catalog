'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ImageCarousel({ images, alt }) {
  const [current, setCurrent] = useState(0)
  const hasImages = images && images.length > 0

  if (!hasImages) {
    return (
      <div className="aspect-square w-full img-placeholder flex items-center justify-center">
        <span className="text-[3rem] tracking-[0.3em] font-bold text-v-border select-none">
          VAULTED
        </span>
      </div>
    )
  }

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square w-full overflow-hidden bg-v-surface">
        <Image
          src={images[current]}
          alt={`${alt} — image ${current + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-v-black/70 border border-v-border hover:border-v-gold flex items-center justify-center text-v-text hover:text-v-gold transition-all duration-200"
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-v-black/70 border border-v-border hover:border-v-gold flex items-center justify-center text-v-text hover:text-v-gold transition-all duration-200"
              aria-label="Next image"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-v-muted bg-v-black/60 px-2 py-1">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden border transition-all duration-200 ${
                i === current ? 'border-v-gold' : 'border-v-border hover:border-v-muted'
              }`}
            >
              <Image
                src={src}
                alt={`${alt} thumbnail ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
