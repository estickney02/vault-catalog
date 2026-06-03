'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

const EMPTY_FORM = {
  name: '',
  brand: '',
  type: '',
  description: '',
  link: '',
  images: [],
  featured: false,
}

export default function AdminDashboard() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const t = sessionStorage.getItem('vault_admin_token')
    if (!t) {
      router.replace('/admin')
      return
    }
    setToken(t)
    fetchProducts(t)
  }, [router])

  function showToast(msg, isError = false) {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }

  async function fetchProducts(t) {
    try {
      const res = await fetch('/api/products', {
        headers: { 'x-admin-token': t || token },
      })
      const data = await res.json()
      setProducts(data)
    } catch {
      showToast('Failed to load products.', true)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(product) {
    setForm({
      name: product.name || '',
      brand: product.brand || '',
      type: product.type || '',
      description: product.description || '',
      link: product.link || '',
      images: product.images || [],
      featured: product.featured || false,
    })
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleNew() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  async function handleImageUpload(e) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const fd = new FormData()
      for (const file of files) fd.append('images', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setForm((f) => ({ ...f, images: [...f.images, ...data.paths] }))
      showToast(`Uploaded ${data.paths.length} image(s).`)
    } catch (err) {
      showToast(err.message || 'Upload failed.', true)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function removeImage(idx) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Save failed')

      showToast(editingId ? 'Product updated.' : 'Product added.')
      handleCancel()
      fetchProducts(token)
    } catch {
      showToast('Failed to save product.', true)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      })
      if (!res.ok) throw new Error()
      showToast('Product deleted.')
      setDeleteConfirm(null)
      fetchProducts(token)
    } catch {
      showToast('Failed to delete.', true)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('vault_admin_token')
    router.push('/admin')
  }

  if (!token) return null

  return (
    <div className="pt-16 min-h-screen">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 text-sm font-medium tracking-wide ${
            toast.isError ? 'bg-red-900/90 text-red-200' : 'bg-v-gold text-v-black'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-v-dark border-b border-v-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
          <div>
            <p className="section-label mb-1">Admin Dashboard</p>
            <h1 className="text-2xl font-bold tracking-tight">VAULTED</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleNew}
              className="btn-gold text-[11px]"
            >
              + Add Product
            </button>
            <button
              onClick={handleLogout}
              className="text-xs tracking-widest uppercase link-gold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product Form */}
        {showForm && (
          <div className="mb-12 bg-v-surface border border-v-border p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold tracking-tight">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-v-muted hover:text-v-text transition-colors text-sm"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-v-dark border border-v-border text-v-text placeholder-v-muted text-sm px-4 py-3 focus:outline-none focus:border-v-gold transition-colors"
                  placeholder="e.g. Oversized Wool Coat"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  className="w-full bg-v-dark border border-v-border text-v-text placeholder-v-muted text-sm px-4 py-3 focus:outline-none focus:border-v-gold transition-colors"
                  placeholder="e.g. Loro Piana"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
                  Clothing Type *
                </label>
                <select
                  required
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full bg-v-dark border border-v-border text-v-text text-sm px-4 py-3 focus:outline-none focus:border-v-gold transition-colors cursor-pointer"
                >
                  <option value="">Select type...</option>
                  {CLOTHING_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* KakoBuy link */}
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
                  KakoBuy Affiliate Link *
                </label>
                <input
                  type="url"
                  required
                  value={form.link}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  className="w-full bg-v-dark border border-v-border text-v-text placeholder-v-muted text-sm px-4 py-3 focus:outline-none focus:border-v-gold transition-colors"
                  placeholder="https://www.kakobuy.com/..."
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-v-dark border border-v-border text-v-text placeholder-v-muted text-sm px-4 py-3 focus:outline-none focus:border-v-gold transition-colors resize-none"
                  placeholder="Write a detailed product description..."
                />
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
                  Product Images
                </label>

                <div className="flex flex-wrap gap-3 mb-3">
                  {form.images.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 border border-v-border">
                      <Image
                        src={src}
                        alt={`Image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white text-xs flex items-center justify-center rounded-full hover:bg-red-500"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`btn-outline-gold text-[11px] cursor-pointer ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? 'Uploading...' : '+ Upload Images'}
                  </label>
                  <p className="text-xs text-v-muted">JPG, PNG, WebP — multiple allowed</p>
                </div>
              </div>

              {/* Featured */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                    className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                      form.featured
                        ? 'bg-v-gold border-v-gold'
                        : 'border-v-border group-hover:border-v-muted'
                    }`}
                  >
                    {form.featured && (
                      <span className="text-v-black text-xs font-bold">✓</span>
                    )}
                  </div>
                  <span className="text-sm text-v-muted group-hover:text-v-text transition-colors">
                    Mark as Featured (shown on homepage)
                  </span>
                </label>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-sm text-v-muted hover:text-v-text transition-colors tracking-wide"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product list */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold tracking-tight">
              All Products{' '}
              <span className="text-v-muted font-normal text-sm ml-2">({products.length})</span>
            </h2>
            {!showForm && (
              <button onClick={handleNew} className="btn-outline-gold text-[11px]">
                + Add Product
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-px">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-v-surface animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-v-muted border border-v-border">
              <p className="text-sm tracking-widest uppercase">No products yet</p>
              <button onClick={handleNew} className="mt-4 btn-gold text-[11px]">
                Add Your First Product
              </button>
            </div>
          ) : (
            <div className="space-y-px">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 bg-v-surface border border-v-border px-4 py-4 hover:border-v-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-12 h-12 border border-v-border overflow-hidden">
                      {product.images && product.images[0] ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full img-placeholder flex items-center justify-center">
                          <span className="text-[8px] text-v-border">IMG</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-v-text truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {product.brand && (
                          <span className="text-[10px] text-v-gold">{product.brand}</span>
                        )}
                        {product.type && (
                          <span className="text-[10px] text-v-muted">{product.type}</span>
                        )}
                        {product.featured && (
                          <span className="text-[10px] bg-v-gold/20 text-v-gold px-1.5 py-0.5">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-xs tracking-widest uppercase text-v-muted hover:text-v-gold transition-colors"
                    >
                      Edit
                    </button>

                    {deleteConfirm === product.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-xs tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-v-muted hover:text-v-text transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="text-xs tracking-widest uppercase text-v-muted hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
