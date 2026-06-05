'use client'

import Link        from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/',             label: 'Home' },
    { href: '/shop',         label: 'Shop' },
    { href: '/#categories',  label: 'Categories' },
    { href: '/#how-it-works',label: 'How It Works' },
  ]

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
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: search icon */}
          <div className="hidden md:flex items-center">
            <Link href="/shop" aria-label="Search" className="text-emf-black hover:text-emf-pink-dk transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </Link>
          </div>

          {/* Mobile burger */}
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <div className="flex flex-col gap-1.5 w-5">
              <span className={`block h-px bg-emf-black transition-all duration-300 ${open ? 'rotate-45 translate-y-2.5' : ''}`}/>
              <span className={`block h-px bg-emf-black transition-all duration-300 ${open ? 'opacity-0' : ''}`}/>
              <span className={`block h-px bg-emf-black transition-all duration-300 ${open ? '-rotate-45 -translate-y-2.5' : ''}`}/>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-emf-ivory border-t border-emf-border px-6 py-6 flex flex-col gap-5">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="font-display text-xs tracking-[0.18em] uppercase text-emf-black hover:text-emf-pink-dk transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/shop" onClick={() => setOpen(false)}
            className="font-display text-xs tracking-[0.18em] uppercase text-emf-muted hover:text-emf-pink-dk transition-colors">
            Search
          </Link>
        </div>
      )}
    </nav>
  )
}
