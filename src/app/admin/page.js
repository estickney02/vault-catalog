'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('vault_admin_token')
    if (token) router.replace('/admin/dashboard')
  }, [router])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError('Invalid password.')
        setLoading(false)
        return
      }

      sessionStorage.setItem('vault_admin_token', data.token)
      router.push('/admin/dashboard')
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="section-label mb-3">Admin Access</p>
          <h1 className="text-3xl font-bold tracking-[0.2em]">EMONEYFINDS</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-v-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full bg-v-surface border border-v-border text-v-text placeholder-v-muted text-sm px-4 py-3 focus:outline-none focus:border-v-gold transition-colors"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Enter Dashboard'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-v-muted/50">
          Default password is in your README.
        </p>
      </div>
    </div>
  )
}
