'use client'

import Link         from 'next/link'
import { useState } from 'react'
import { CLOTHING_TYPES } from '@/config'

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [catOpen,      setCatOpen]      = useState(false)
  const [mobileCatOpen,setMobileCatOpen]= useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-emf-ivory border-b border-emf-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link href="/" className="font-script text-2xl text-emf-black hover:text-emf-pink-dk transition-colors leading-none">
            Emoney Finds
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">

            <Link href="/" className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">
              Home
            </Link>

            <Link href="/shop" className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">
              Shop
            </Link>

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors flex items-center gap-1">
                Categories
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              {catOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white border border-emf-border shadow-card-hover z-50">
                  <div className="py-2">
                    {CLOTHING_TYPES.map(cat => (
                      <Link
                        key={cat}
                        href={`/shop?type=${encodeURIComponent(cat)}`}
                        onClick={() => setCatOpen(false)}
                        className="block px-5 py-2.5 font-display text-xs tracking-[0.15em] uppercase text-emf-black hover:bg-emf-pink/10 hover:text-emf-pink-dk transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/#how-it-works" className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">
              How It Works
            </Link>

          </div>

          {/* Search icon */}
          <div className="hidden md:flex">
            <Link href="/shop" aria-label="Search" className="text-emf-black hover:text-emf-pink-dk transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`block h-px bg-emf-black transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2.5' : ''}`}/>
              <span className={`block h-px bg-emf-black transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}/>
              <span className={`block h-px bg-emf-black transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2.5' : ''}`}/>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-emf-ivory border-t border-emf-border px-6 py-5 flex flex-col gap-4">
          <Link href="/" onClick={() => setMobileOpen(false)} className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">Home</Link>
          <Link href="/shop" onClick={() => setMobileOpen(false)} className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">Shop</Link>

          {/* Mobile categories accordion */}
          <div>
            <button
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors flex items-center gap-2 w-full"
            >
              Categories
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {mobileCatOpen && (
              <div className="mt-3 pl-3 flex flex-col gap-3 border-l border-emf-pink/30">
                {CLOTHING_TYPES.map(cat => (
                  <Link key={cat} href={`/shop?type=${encodeURIComponent(cat)}`}
                    onClick={() => { setMobileOpen(false); setMobileCatOpen(false) }}
                    className="font-display text-xs tracking-[0.15em] uppercase text-emf-muted hover:text-emf-pink-dk transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/#how-it-works" onClick={() => setMobileOpen(false)} className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">How It Works</Link>
        </div>
      )}
    </nav>
  )
}
