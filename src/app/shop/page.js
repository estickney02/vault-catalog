'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'

const CLOTHING_TYPES = [
  'Tops',
  'Bottoms',
  'Dresses',
  'Outerwear',
  'Bags',
  'Shoes',
  'Accessories',
  'Jewelry',
]

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState(searchParams.get('type') || '')
  const [filterBrand, setFilterBrand] = useState(searchParams.get('brand') || '')

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products]
  )

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
      const matchesType = !filterType || p.type === filterType
      const matchesBrand = !filterBrand || p.brand === filterBrand
      return matchesSearch && matchesType && matchesBrand
    })
  }, [products, search, filterType, filterBrand])

  return (
    <div className="pt-16 min-h-screen">
      {/* Page header */}
      <div className="border-b border-v-border bg-v-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="section-label mb-2">All Products</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Catalog</h1>
          <p className="text-v-muted mt-3 text-sm">
            {loading ? '—' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 bg-v-dark/95 backdrop-blur-sm border-b border-v-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-v-surface border border-v-border text-v-text placeholder-v-muted text-sm px-4 py-2.5 focus:outline-none focus:border-v-gold transition-colors"
          />

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-v-surface border border-v-border text-v-text text-sm px-4 py-2.5 focus:outline-none focus:border-v-gold transition-colors cursor-pointer sm:w-48"
          >
            <option value="">All Types</option>
            {CLOTHING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Brand filter */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-v-surface border border-v-border text-v-text text-sm px-4 py-2.5 focus:outline-none focus:border-v-gold transition-colors cursor-pointer sm:w-48"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Clear */}
          {(search || filterType || filterBrand) && (
            <button
              onClick={() => {
                setSearch('')
                setFilterType('')
                setFilterBrand('')
              }}
              className="text-xs tracking-widest uppercase text-v-muted hover:text-v-gold transition-colors px-3 border border-v-border hover:border-v-gold whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-v-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-v-black">
                <div className="aspect-[3/4] img-placeholder animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-v-surface animate-pulse w-3/4" />
                  <div className="h-3 bg-v-surface animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-v-border">
            {filtered.map((product) => (
              <div key={product.id} className="bg-v-black">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-v-muted">
            <p className="text-sm tracking-widest uppercase">No products found</p>
            <p className="mt-2 text-xs">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="pt-16 min-h-screen flex items-center justify-center text-v-muted text-sm tracking-widest uppercase">Loading...</div>}>
      <ShopContent />
    </Suspense>
  )
}
