'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CLOTHING_TYPES } from '@/config'

/* ─── helpers ─────────────────────────────────────── */
const EMPTY_PRODUCT = { name:'', brand:'', type:'', description:'', link:'', images:[], featured:false }
const EMPTY_BRAND   = { name:'', description:'', image:'', active:true }

function Toast({ msg, isError, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 font-display text-sm font-medium shadow-lg ${isError ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emf-pink text-white'}`}>
      {msg}
    </div>
  )
}

/* ─── PRODUCTS TAB ────────────────────────────────── */
function ProductsTab({ token }) {
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [form,      setForm]      = useState(EMPTY_PRODUCT)
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [delConfirm,setDelConfirm]= useState(null)
  const [toast,     setToast]     = useState(null)
  const fileRef = useRef(null)

  const headers = { 'x-admin-token': token }

  const load = async () => {
    try { const d = await fetch('/api/products', {headers}).then(r=>r.json()); setProducts(d) }
    catch { setToast({msg:'Failed to load.',isError:true}) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (token) load() }, [token])

  const openNew  = () => { setForm(EMPTY_PRODUCT); setEditId(null); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'}) }
  const openEdit = (p) => { setForm({name:p.name,brand:p.brand,type:p.type,description:p.description,link:p.link,images:p.images||[],featured:p.featured||false}); setEditId(p.id); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'}) }
  const cancel   = () => { setShowForm(false); setEditId(null); setForm(EMPTY_PRODUCT) }

  const uploadImages = async (e) => {
    const files = e.target.files; if (!files?.length) return
    setUploading(true)
    try {
      const fd = new FormData(); for (const f of files) fd.append('images', f)
      const res  = await fetch('/api/upload', {method:'POST', headers, body:fd})
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(f => ({...f, images:[...f.images,...data.paths]}))
      setToast({msg:`Uploaded ${data.paths.length} image(s).`})
    } catch (err) { setToast({msg:err.message||'Upload failed.',isError:true}) }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value='' }
  }

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const url = editId ? `/api/products/${editId}` : '/api/products'
      const res = await fetch(url, {method: editId?'PUT':'POST', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify(form)})
      if (!res.ok) throw new Error()
      setToast({msg: editId ? 'Product updated.' : 'Product added.'})
      cancel(); load()
    } catch { setToast({msg:'Save failed.',isError:true}) }
    finally { setSaving(false) }
  }

  const del = async (id) => {
    try {
      await fetch(`/api/products/${id}`, {method:'DELETE', headers})
      setToast({msg:'Deleted.'}); setDelConfirm(null); load()
    } catch { setToast({msg:'Delete failed.',isError:true}) }
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} isError={toast.isError} onDone={() => setToast(null)} />}

      {/* Form */}
      {showForm && (
        <div className="mb-10 bg-emf-ivory border border-emf-border p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold text-base tracking-wide">{editId ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={cancel} className="font-display text-emf-muted hover:text-emf-black text-sm transition-colors">✕ Cancel</button>
          </div>

          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="admin-label">Product Name *</label>
              <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="admin-input" placeholder="e.g. Oversized Wool Coat" />
            </div>
            <div>
              <label className="admin-label">Brand *</label>
              <input required value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))} className="admin-input" placeholder="e.g. Chanel" />
            </div>
            <div>
              <label className="admin-label">Clothing Type *</label>
              <select required value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="admin-input cursor-pointer">
                <option value="">Select type…</option>
                {CLOTHING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">KakoBuy Affiliate Link *</label>
              <input required type="url" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} className="admin-input" placeholder="https://www.kakobuy.com/..." />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Description</label>
              <textarea rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="admin-input resize-none" placeholder="Product description…" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Images</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.images.map((src,i) => (
                  <div key={i} className="relative w-16 h-16 border border-emf-border overflow-hidden">
                    <Image src={src} alt="" fill className="object-cover" sizes="64px"/>
                    <button type="button" onClick={() => setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">✕</button>
                  </div>
                ))}
              </div>
              <input type="file" ref={fileRef} multiple accept="image/*" onChange={uploadImages} className="hidden" id="p-img-upload"/>
              <label htmlFor="p-img-upload" className={`btn-outline-pink inline-block cursor-pointer text-[10px] ${uploading?'opacity-50':''}`}>
                {uploading ? 'Uploading…' : '+ Upload Images'}
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div onClick={()=>setForm(f=>({...f,featured:!f.featured}))}
                  className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${form.featured?'bg-emf-pink border-emf-pink':'border-emf-border group-hover:border-emf-pink'}`}>
                  {form.featured && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="font-display text-sm text-emf-muted group-hover:text-emf-black transition-colors">Mark as Featured (appears in homepage carousel)</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-4 pt-2">
              <button type="submit" disabled={saving} className="btn-pink disabled:opacity-50">{saving ? 'Saving…' : editId ? 'Update Product' : 'Add Product'}</button>
              <button type="button" onClick={cancel} className="font-display text-sm text-emf-muted hover:text-emf-black transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-base tracking-wide">
          All Products <span className="text-emf-muted font-normal text-sm ml-2">({products.length})</span>
        </h3>
        {!showForm && <button onClick={openNew} className="btn-pink text-[10px]">+ Add Product</button>}
      </div>

      {loading ? (
        <div className="space-y-px">{Array.from({length:4}).map((_,i)=><div key={i} className="h-16 bg-emf-surface animate-pulse"/>)}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 border border-emf-border font-display text-emf-muted text-sm">
          No products yet.
          <button onClick={openNew} className="btn-pink ml-4 text-[10px]">Add First Product</button>
        </div>
      ) : (
        <div className="space-y-px">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-4 bg-white border border-emf-border px-4 py-3 hover:border-emf-pink/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 border border-emf-border overflow-hidden bg-emf-surface">
                  {p.images?.[0] ? (
                    <div className="relative w-full h-full"><Image src={p.images[0]} alt="" fill className="object-cover" sizes="48px"/></div>
                  ) : (
                    <div className="w-full h-full bg-emf-pink/10 flex items-center justify-center"><span className="text-[8px] text-emf-pink font-display">IMG</span></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-medium text-sm text-emf-black truncate">{p.name}</p>
                  <div className="flex gap-2 mt-0.5">
                    {p.brand && <span className="font-display text-[10px] text-emf-pink">{p.brand}</span>}
                    {p.type  && <span className="font-display text-[10px] text-emf-muted">{p.type}</span>}
                    {p.featured && <span className="font-display text-[10px] bg-emf-pink/20 text-emf-pink-dk px-1.5 py-0.5 rounded-full">Featured</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => openEdit(p)} className="font-display text-xs tracking-widest uppercase text-emf-muted hover:text-emf-pink-dk transition-colors">Edit</button>
                {delConfirm === p.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => del(p.id)} className="font-display text-xs tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors">Confirm</button>
                    <button onClick={() => setDelConfirm(null)} className="font-display text-xs text-emf-muted hover:text-emf-black transition-colors">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setDelConfirm(p.id)} className="font-display text-xs tracking-widest uppercase text-emf-muted hover:text-red-500 transition-colors">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── BRANDS TAB ──────────────────────────────────── */
function BrandsTab({ token }) {
  const [brands,    setBrands]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [showForm,  setShowForm]  = useState(false)
  const [editId,    setEditId]    = useState(null)
  const [form,      setForm]      = useState(EMPTY_BRAND)
  const [uploading, setUploading] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [delConfirm,setDelConfirm]= useState(null)
  const [toast,     setToast]     = useState(null)
  const fileRef = useRef(null)

  const headers = { 'x-admin-token': token }

  const load = async () => {
    try { const d = await fetch('/api/brands').then(r=>r.json()); setBrands(d) }
    catch { setToast({msg:'Failed to load.',isError:true}) }
    finally { setLoading(false) }
  }

  useEffect(() => { if (token) load() }, [token])

  const openNew  = () => { setForm(EMPTY_BRAND); setEditId(null); setShowForm(true) }
  const openEdit = (b) => { setForm({name:b.name,description:b.description||'',image:b.image||'',active:b.active??true}); setEditId(b.id); setShowForm(true) }
  const cancel   = () => { setShowForm(false); setEditId(null); setForm(EMPTY_BRAND) }

  const uploadImage = async (e) => {
    const files = e.target.files; if (!files?.length) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('images', files[0])
      const res  = await fetch('/api/upload', {method:'POST', headers, body:fd})
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(f => ({...f, image: data.paths[0]}))
      setToast({msg:'Image uploaded.'})
    } catch (err) { setToast({msg:err.message||'Upload failed.',isError:true}) }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value='' }
  }

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const url = editId ? `/api/brands/${editId}` : '/api/brands'
      const res = await fetch(url, {method: editId?'PUT':'POST', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify(form)})
      if (!res.ok) throw new Error()
      setToast({msg: editId ? 'Brand updated.' : 'Brand added.'})
      cancel(); load()
    } catch { setToast({msg:'Save failed.',isError:true}) }
    finally { setSaving(false) }
  }

  const del = async (id) => {
    try { await fetch(`/api/brands/${id}`, {method:'DELETE', headers}); setToast({msg:'Deleted.'}); setDelConfirm(null); load() }
    catch { setToast({msg:'Delete failed.',isError:true}) }
  }

  const toggleActive = async (b) => {
    try {
      await fetch(`/api/brands/${b.id}`, {method:'PUT', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify({...b, active:!b.active})})
      load()
    } catch { setToast({msg:'Update failed.',isError:true}) }
  }

  return (
    <div>
      {toast && <Toast msg={toast.msg} isError={toast.isError} onDone={() => setToast(null)} />}

      {showForm && (
        <div className="mb-10 bg-emf-ivory border border-emf-border p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display font-semibold text-base">{editId ? 'Edit Brand' : 'Add New Brand'}</h3>
            <button onClick={cancel} className="font-display text-emf-muted hover:text-emf-black text-sm">✕ Cancel</button>
          </div>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">Brand Name *</label>
              <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} className="admin-input" placeholder="e.g. Chanel" />
            </div>
            <div>
              <label className="admin-label">Category / Description</label>
              <input value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} className="admin-input" placeholder="e.g. Luxury" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Cover Image</label>
              {form.image && (
                <div className="relative w-24 h-16 border border-emf-border overflow-hidden mb-2">
                  <Image src={form.image} alt="" fill className="object-cover" sizes="96px"/>
                </div>
              )}
              <input type="file" ref={fileRef} accept="image/*" onChange={uploadImage} className="hidden" id="b-img-upload"/>
              <label htmlFor="b-img-upload" className={`btn-outline-pink inline-block cursor-pointer text-[10px] ${uploading?'opacity-50':''}`}>
                {uploading ? 'Uploading…' : form.image ? 'Replace Image' : '+ Upload Image'}
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div onClick={()=>setForm(f=>({...f,active:!f.active}))}
                  className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${form.active?'bg-emf-pink border-emf-pink':'border-emf-border'}`}>
                  {form.active && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="font-display text-sm text-emf-muted">Active (visible on site)</span>
              </label>
            </div>
            <div className="md:col-span-2 flex gap-4 pt-2">
              <button type="submit" disabled={saving} className="btn-pink disabled:opacity-50">{saving ? 'Saving…' : editId ? 'Update Brand' : 'Add Brand'}</button>
              <button type="button" onClick={cancel} className="font-display text-sm text-emf-muted hover:text-emf-black transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-semibold text-base">All Brands <span className="text-emf-muted font-normal text-sm ml-2">({brands.length})</span></h3>
        {!showForm && <button onClick={openNew} className="btn-pink text-[10px]">+ Add Brand</button>}
      </div>

      {loading ? (
        <div className="space-y-px">{Array.from({length:4}).map((_,i)=><div key={i} className="h-14 bg-emf-surface animate-pulse"/>)}</div>
      ) : brands.length === 0 ? (
        <div className="text-center py-16 border border-emf-border font-display text-emf-muted text-sm">No brands yet.</div>
      ) : (
        <div className="space-y-px">
          {brands.map(b => (
            <div key={b.id} className="flex items-center justify-between gap-4 bg-white border border-emf-border px-4 py-3 hover:border-emf-pink/40 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-12 h-10 border border-emf-border overflow-hidden bg-emf-surface">
                  {b.image ? (
                    <div className="relative w-full h-full"><Image src={b.image} alt="" fill className="object-cover" sizes="48px"/></div>
                  ) : (
                    <div className="w-full h-full bg-emf-pink/10 flex items-center justify-center"><span className="text-[8px] text-emf-pink font-display">IMG</span></div>
                  )}
                </div>
                <div>
                  <p className="font-display font-medium text-sm">{b.name}</p>
                  {b.description && <p className="font-display text-[10px] text-emf-muted">{b.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button onClick={() => toggleActive(b)}
                  className={`font-display text-[10px] tracking-widest uppercase px-2 py-1 border transition-colors ${b.active ? 'border-emf-pink text-emf-pink hover:bg-emf-pink hover:text-white' : 'border-emf-border text-emf-muted hover:border-emf-pink hover:text-emf-pink'}`}>
                  {b.active ? 'Visible' : 'Hidden'}
                </button>
                <button onClick={() => openEdit(b)} className="font-display text-xs tracking-widest uppercase text-emf-muted hover:text-emf-pink-dk transition-colors">Edit</button>
                {delConfirm === b.id ? (
                  <div className="flex items-center gap-2">
                    <button onClick={() => del(b.id)} className="font-display text-xs uppercase text-red-500">Confirm</button>
                    <button onClick={() => setDelConfirm(null)} className="font-display text-xs text-emf-muted">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setDelConfirm(b.id)} className="font-display text-xs tracking-widest uppercase text-emf-muted hover:text-red-500 transition-colors">Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── SETTINGS TAB ────────────────────────────────── */
function SettingsTab({ token }) {
  const [settings, setSettings] = useState({ kakobuyLink:'', instagramUrl:'', tiktokUrl:'' })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [toast,    setToast]    = useState(null)

  const headers = { 'x-admin-token': token }

  useEffect(() => {
    if (!token) return
    fetch('/api/settings').then(r=>r.json()).then(d => { setSettings(d); setLoading(false) }).catch(() => setLoading(false))
  }, [token])

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const res = await fetch('/api/settings', {method:'PUT', headers:{...headers,'Content-Type':'application/json'}, body:JSON.stringify(settings)})
      if (!res.ok) throw new Error()
      setToast({msg:'Settings saved.'})
    } catch { setToast({msg:'Save failed.',isError:true}) }
    finally { setSaving(false) }
  }

  if (loading) return <div className="font-display text-sm text-emf-muted animate-pulse">Loading settings…</div>

  return (
    <div className="max-w-lg">
      {toast && <Toast msg={toast.msg} isError={toast.isError} onDone={() => setToast(null)} />}
      <form onSubmit={save} className="flex flex-col gap-6">
        <div>
          <label className="admin-label">KakoBuy Affiliate / Referral Link</label>
          <input type="url" value={settings.kakobuyLink||''} onChange={e=>setSettings(s=>({...s,kakobuyLink:e.target.value}))}
            className="admin-input" placeholder="https://ikako.vip/r/YOURCODE" />
          <p className="font-display text-xs text-emf-muted mt-1">This is the link used in the "How It Works" Sign Up button.</p>
        </div>
        <div>
          <label className="admin-label">Instagram URL</label>
          <input type="url" value={settings.instagramUrl||''} onChange={e=>setSettings(s=>({...s,instagramUrl:e.target.value}))}
            className="admin-input" placeholder="https://instagram.com/..." />
        </div>
        <div>
          <label className="admin-label">TikTok URL</label>
          <input type="url" value={settings.tiktokUrl||''} onChange={e=>setSettings(s=>({...s,tiktokUrl:e.target.value}))}
            className="admin-input" placeholder="https://tiktok.com/@..." />
        </div>
        <button type="submit" disabled={saving} className="btn-pink self-start disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

/* ─── DASHBOARD ROOT ──────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [tab,   setTab]   = useState('products')

  useEffect(() => {
    const t = sessionStorage.getItem('emf_admin_token')
    if (!t) { router.replace('/admin'); return }
    setToken(t)
  }, [router])

  if (!token) return null

  const tabs = [
    { id:'products', label:'Products' },
    { id:'brands',   label:'Brands'   },
    { id:'settings', label:'Settings' },
  ]

  return (
    <div className="min-h-screen bg-emf-ivory">
      {/* Header */}
      <div className="bg-white border-b border-emf-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="font-script text-3xl text-emf-black leading-none">Emoney Finds</h1>
            <p className="font-display text-[10px] tracking-[0.25em] uppercase text-emf-muted mt-1">Admin Dashboard</p>
          </div>
          <button onClick={() => { sessionStorage.removeItem('emf_admin_token'); router.push('/admin') }}
            className="font-display text-xs tracking-widest uppercase text-emf-muted hover:text-emf-pink-dk transition-colors">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-0 border-t border-emf-border">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`font-display text-xs tracking-[0.2em] uppercase px-6 py-4 border-b-2 transition-colors ${tab === t.id ? 'border-emf-pink text-emf-pink' : 'border-transparent text-emf-muted hover:text-emf-black'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {tab === 'products' && <ProductsTab token={token} />}
        {tab === 'brands'   && <BrandsTab   token={token} />}
        {tab === 'settings' && <SettingsTab token={token} />}
      </div>
    </div>
  )
}
