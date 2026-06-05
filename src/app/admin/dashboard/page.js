'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CLOTHING_TYPES } from '@/config'

/* ─── helpers ─────────────────────────────────────── */
const EMPTY_PRODUCT = { name:'', brand:'', type:'', price:'', description:'', link:'', images:[], featured:false }
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
  const openEdit = (p) => { setForm({name:p.name,brand:p.brand,type:p.type,price:p.price||'',description:p.description,link:p.link,images:p.images||[],featured:p.featured||false}); setEditId(p.id); setShowForm(true); window.scrollTo({top:0,behavior:'smooth'}) }
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
            <div>
              <label className="admin-label">KakoBuy Affiliate Link *</label>
              <input required type="url" value={form.link} onChange={e=>setForm(f=>({...f,link:e.target.value}))} className="admin-input" placeholder="https://www.kakobuy.com/..." />
            </div>
            <div>
              <label className="admin-label">Price (e.g. $42)</label>
              <input value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="admin-input" placeholder="e.g. $42" />
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

/* ─── BULK IMPORT TAB ────────────────────────────── */
function BulkImportTab({ token }) {
  const [rows,      setRows]      = useState([])   // parsed CSV rows
  const [selected,  setSelected]  = useState({})   // id → bool
  const [importing, setImporting] = useState(false)
  const [result,    setResult]    = useState(null)  // { success, skipped }
  const [toast,     setToast]     = useState(null)
  const fileRef = useRef(null)

  const headers = { 'x-admin-token': token }

  // Split a CSV line respecting quoted fields (handles commas inside quotes)
  const splitLine = (line) => {
    const cols = []; let cur = '', inQ = false
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ }
      else if (ch === ',' && !inQ) { cols.push(cur); cur = '' }
      else cur += ch
    }
    cols.push(cur)
    return cols.map(c => c.trim().replace(/^"|"$/g, ''))
  }

  // Known category/section header words to skip
  const SKIP_WORDS = new Set(['shoes','tops','t-shirts','jacket','skirts','bags','sweaters','shorts','perfume','shirts/polo','hoodies','electronics','dresses','pants','accessories','alo','lululemon','zara','image','sign up link for coupons'])

  const parseCSV = (text) => {
    // Collapse multi-line quoted cells first
    const normalized = text.replace(/"[^"]*"/g, m => m.replace(/\n/g, ' '))
    const lines = normalized.trim().split('\n')
    if (lines.length < 2) return []

    // Find the header row — look for a row containing 'product' or 'name'
    let headerIdx = 0
    for (let i = 0; i < Math.min(lines.length, 15); i++) {
      const lower = lines[i].toLowerCase()
      if (lower.includes('product') || lower.includes('name')) { headerIdx = i; break }
    }
    const rawHeader = splitLine(lines[headerIdx]).map(h => h.toLowerCase())

    // Map flexible column names → standard keys
    const colMap = {}
    rawHeader.forEach((h, idx) => {
      if (/^name$|^product/.test(h))             colMap.name  = idx
      if (/^brand/.test(h))                       colMap.brand = idx
      if (/^categor|^type/.test(h))               colMap.type  = idx
      if (/^desc/.test(h))                        colMap.description = idx
      if (/kakobuy|^link$/.test(h))               colMap.link  = idx
      if (/price.*usd|^price$/.test(h))           colMap.price = idx
      if (/image_url|image url/.test(h))          colMap.image = idx
      if (/^featured/.test(h))                    colMap.featured = idx
    })

    return lines.slice(headerIdx + 1).map((line, i) => {
      const cols = splitLine(line)
      const get  = (key) => (cols[colMap[key]] || '').trim()

      const name  = get('name')
      const price = get('price')
      const rawLink = get('link')
      // If link is literally "LINK" or "link", treat as empty (was a hyperlink in spreadsheet)
      const link  = /^link$/i.test(rawLink) ? '' : rawLink

      // Skip blank rows and category header rows
      if (!name) return null
      if (SKIP_WORDS.has(name.toLowerCase())) return null
      if (cols.every(c => !c)) return null

      return {
        _id:         i,
        name,
        brand:       get('brand'),
        type:        get('type'),
        description: get('description'),
        link,
        price,
        images:      get('image') ? [get('image')] : [],
        featured:    get('featured').toLowerCase() === 'true',
        _error:      !name,  // only require name — link can be added later
        _noLink:     !link,  // flag for missing link (warning, not error)
      }
    }).filter(Boolean)
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setResult(null)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result)
      setRows(parsed)
      const sel = {}
      parsed.forEach(r => { sel[r._id] = true }) // select all by default, including no-link rows
      setSelected(sel)
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  const toggle = (id) => setSelected(s => ({ ...s, [id]: !s[id] }))
  const toggleAll = () => {
    const validIds = rows.filter(r => !r._error).map(r => r._id)
    const allOn = validIds.every(id => selected[id])
    const next = { ...selected }
    validIds.forEach(id => { next[id] = !allOn })
    setSelected(next)
  }

  const importAll = async () => {
    setImporting(true); setResult(null)
    const toImport = rows.filter(r => selected[r._id] && !r._error)
    let success = 0
    for (const row of toImport) {
      try {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: row.name, brand: row.brand, type: row.type,
            description: row.description, link: row.link,
            images: row.images, price: row.price, featured: row.featured,
          })
        })
        if (res.ok) success++
      } catch {}
    }
    setImporting(false)
    setResult({ success, skipped: toImport.length - success })
    setRows([]); setSelected({})
  }

  const selectedCount = rows.filter(r => selected[r._id] && !r._error).length
  const errorCount    = rows.filter(r => r._error).length
  const noLinkCount   = rows.filter(r => !r._error && r._noLink).length

  return (
    <div>
      {toast && <Toast msg={toast.msg} isError={toast.isError} onDone={() => setToast(null)} />}

      <div className="mb-8">
        <h3 className="font-display font-semibold text-base tracking-wide mb-1">Bulk Import Products</h3>
        <p className="font-display text-xs text-emf-muted">Upload a CSV file to import multiple products at once.</p>
      </div>

      {/* CSV format guide */}
      <div className="mb-6 bg-emf-surface border border-emf-border p-4">
        <p className="font-display text-xs font-semibold text-emf-black mb-2 tracking-wide uppercase">Supported CSV Columns</p>
        <code className="font-mono text-[11px] text-emf-muted break-all">
          name / product, brand, category / type, description, kakobuy_link / link, price, image_url, featured
        </code>
        <p className="font-display text-[10px] text-emf-muted mt-2">* Only <strong>name/product</strong> is required. Products without a link will be imported and can be edited later. Works with spreadsheet exports (Google Sheets, Excel).</p>
      </div>

      {/* Upload */}
      <div className="mb-6">
        <input type="file" accept=".csv" ref={fileRef} onChange={onFile} className="hidden" id="csv-upload" />
        <label htmlFor="csv-upload" className="btn-outline inline-block cursor-pointer">
          📂 Choose CSV File
        </label>
      </div>

      {/* Result banner */}
      {result && (
        <div className="mb-6 bg-emf-pink/10 border border-emf-pink/30 px-5 py-4 font-display text-sm text-emf-black">
          ✅ <strong>{result.success} product{result.success !== 1 ? 's' : ''} imported successfully</strong>
          {result.skipped > 0 && <span className="text-emf-muted ml-2">({result.skipped} failed)</span>}
          <span className="block text-[11px] text-emf-muted mt-1">Products are now live on the site.</span>
        </div>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <p className="font-display text-sm font-semibold">
                {rows.length} rows detected
                {errorCount > 0  && <span className="text-red-500 ml-2">· {errorCount} skipped (no name)</span>}
              {noLinkCount > 0 && <span className="text-amber-500 ml-2">· {noLinkCount} missing KakoBuy link</span>}
              </p>
              <button onClick={toggleAll} className="font-display text-xs text-emf-muted hover:text-emf-black underline underline-offset-2 transition-colors">
                {rows.filter(r=>!r._error).every(r=>selected[r._id]) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <button
              onClick={importAll}
              disabled={importing || selectedCount === 0}
              className="btn-pink disabled:opacity-40"
            >
              {importing ? 'Importing…' : `Import ${selectedCount} Product${selectedCount !== 1 ? 's' : ''}`}
            </button>
          </div>

          <div className="border border-emf-border overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-emf-surface border-b border-emf-border">
                <tr>
                  <th className="px-3 py-2 w-8"></th>
                  <th className="px-3 py-2 font-display text-[10px] tracking-widest uppercase text-emf-muted">Name</th>
                  <th className="px-3 py-2 font-display text-[10px] tracking-widest uppercase text-emf-muted">Brand</th>
                  <th className="px-3 py-2 font-display text-[10px] tracking-widest uppercase text-emf-muted">Category</th>
                  <th className="px-3 py-2 font-display text-[10px] tracking-widest uppercase text-emf-muted">Price</th>
                  <th className="px-3 py-2 font-display text-[10px] tracking-widest uppercase text-emf-muted">Link</th>
                  <th className="px-3 py-2 font-display text-[10px] tracking-widest uppercase text-emf-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row._id}
                    className={`border-b border-emf-border last:border-0 transition-colors ${
                      row._error ? 'bg-red-50' : row._noLink && selected[row._id] ? 'bg-amber-50' : selected[row._id] ? 'bg-white' : 'bg-emf-surface/50 opacity-50'
                    }`}
                  >
                    <td className="px-3 py-2">
                      {!row._error && (
                        <div onClick={() => toggle(row._id)}
                          className={`w-4 h-4 border-2 flex items-center justify-center cursor-pointer transition-colors ${selected[row._id] ? 'bg-emf-pink border-emf-pink' : 'border-emf-border hover:border-emf-pink'}`}>
                          {selected[row._id] && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 font-display text-xs text-emf-black max-w-[160px] truncate">{row.name || <span className="text-red-400 italic">missing</span>}</td>
                    <td className="px-3 py-2 font-display text-xs text-emf-muted">{row.brand}</td>
                    <td className="px-3 py-2 font-display text-xs text-emf-muted">{row.type}</td>
                    <td className="px-3 py-2 font-display text-xs text-emf-muted">{row.price}</td>
                    <td className="px-3 py-2 font-display text-xs text-emf-muted max-w-[160px] truncate">
                      {row.link ? <span className="text-emf-pink-dk">{row.link}</span> : <span className="text-red-400 italic">missing</span>}
                    </td>
                    <td className="px-3 py-2">
                      {row._error
                        ? <span className="font-display text-[10px] text-red-500 bg-red-100 px-2 py-0.5">Skipped — no name</span>
                        : row._noLink
                          ? <span className="font-display text-[10px] text-amber-600 bg-amber-100 px-2 py-0.5">No link yet</span>
                          : <span className="font-display text-[10px] text-emf-pink bg-emf-pink/10 px-2 py-0.5">Ready</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={importAll}
              disabled={importing || selectedCount === 0}
              className="btn-pink disabled:opacity-40"
            >
              {importing ? 'Importing…' : `Import ${selectedCount} Product${selectedCount !== 1 ? 's' : ''}`}
            </button>
          </div>
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
    { id:'products', label:'Products'    },
    { id:'brands',   label:'Brands'      },
    { id:'bulk',     label:'Bulk Import' },
    { id:'settings', label:'Settings'    },
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
        {tab === 'products' && <ProductsTab    token={token} />}
        {tab === 'brands'   && <BrandsTab      token={token} />}
        {tab === 'bulk'     && <BulkImportTab  token={token} />}
        {tab === 'settings' && <SettingsTab    token={token} />}
      </div>
    </div>
  )
}
