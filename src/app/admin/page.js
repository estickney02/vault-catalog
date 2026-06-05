'use client'

import { useState, useEffect } from 'react'
import { useRouter }            from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('emf_admin_token')) router.replace('/admin/dashboard')
  }, [router])

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res  = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({password}) })
      const data = await res.json()
      if (!res.ok) { setError('Incorrect password.'); setLoading(false); return }
      sessionStorage.setItem('emf_admin_token', data.token)
      router.push('/admin/dashboard')
    } catch { setError('Connection error.'); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-emf-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-script text-4xl text-emf-black mb-2">Emoney Finds</h1>
          <p className="font-display text-xs tracking-[0.25em] uppercase text-emf-muted">Admin Dashboard</p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div>
            <label className="admin-label">Password</label>
            <input
              type="password" required autoFocus
              value={password} onChange={e => setPassword(e.target.value)}
              className="admin-input"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="font-display text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className="btn-pink w-full mt-2 disabled:opacity-50">
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>

        <p className="font-display text-center text-xs text-emf-muted/40 mt-8">
          Default password is in your README.
        </p>
      </div>
    </div>
  )
}
