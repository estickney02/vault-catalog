'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-v-black/90 backdrop-blur-sm border-b border-v-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-[0.3em] text-v-text hover:text-v-gold transition-colors duration-200"
          >
            EMONEYFINDS
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-sm tracking-widest uppercase link-gold">
              Shop
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-widest uppercase link-gold"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm tracking-widest uppercase link-gold"
            >
              TikTok
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-v-muted hover:text-v-text transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-6">
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  menuOpen ? 'rotate-45 translate-y-2.5' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  menuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px bg-current transition-all duration-300 ${
                  menuOpen ? '-rotate-45 -translate-y-2.5' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-v-dark border-t border-v-border px-4 py-6 flex flex-col gap-5">
          <Link
            href="/shop"
            className="text-sm tracking-widest uppercase link-gold"
            onClick={() => setMenuOpen(false)}
          >
            Shop
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-widest uppercase link-gold"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-widest uppercase link-gold"
          >
            TikTok
          </a>
        </div>
      )}
    </nav>
  )
}
