'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { CLOTHING_TYPES } from '@/config'

function ShopContent() {
  const searchParams               = useSearchParams()
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search,  setSearch]      = useState('')
  const [filterType,  setType]    = useState(searchParams.get('type')  || '')
  const [filterBrand, setBrand]   = useState(searchParams.get('brand') || '')

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => { setProducts(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))].sort(), [products])

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase()
    return (
      (!search || p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q)) &&
      (!filterType  || p.type  === filterType) &&
      (!filterBrand || p.brand === filterBrand)
    )
  }), [products, search, filterType, filterBrand])

  const hasFilters = search || filterType || filterBrand

  return (
    <div className="min-h-screen bg-emf-ivory">
      {/* Header */}
      <div className="bg-emf-white border-b border-emf-border py-14 px-4 text-center">
        <p className="section-eyebrow mb-3">The Collection</p>
        <h1 className="font-script text-6xl md:text-7xl text-emf-black leading-none">Emoney Finds</h1>
        <p className="font-display text-emf-muted text-sm mt-3">
          {loading ? '—' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-emf-white border-b border-emf-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 border border-emf-border bg-emf-ivory font-display text-sm px-4 py-2.5 focus:outline-none focus:border-emf-pink transition-colors placeholder:text-emf-muted"
          />
          <select value={filterType} onChange={e => setType(e.target.value)}
            className="border border-emf-border bg-emf-ivory font-display text-sm px-4 py-2.5 focus:outline-none focus:border-emf-pink transition-colors sm:w-44 cursor-pointer">
            <option value="">All Types</option>
            {CLOTHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterBrand} onChange={e => setBrand(e.target.value)}
            className="border border-emf-border bg-emf-ivory font-display text-sm px-4 py-2.5 focus:outline-none focus:border-emf-pink transition-colors sm:w-44 cursor-pointer">
            <option value="">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setType(''); setBrand('') }}
              className="font-display text-xs tracking-widest uppercase text-emf-muted hover:text-emf-pink-dk border border-emf-border px-4 transition-colors whitespace-nowrap">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="bg-white shadow-card overflow-hidden">
                <div className="aspect-square bg-emf-surface animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-emf-surface animate-pulse w-1/3 rounded-full" />
                  <div className="h-4 bg-emf-surface animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-32 font-display text-emf-muted">
            <p className="text-sm tracking-widest uppercase">No products found</p>
            <p className="mt-2 text-xs">Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-emf-ivory flex items-center justify-center font-display text-sm tracking-widest text-emf-muted uppercase">Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
