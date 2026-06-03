'use client'

import { useState, useEffect } from 'react'
import { KAKOBUY_REGISTER_URL } from '@/config'

export default function FloatingRegisterCTA() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('float_cta_dismissed')) {
      setDismissed(true)
      return
    }
    // Show after scrolling down 300px
    const onScroll = () => {
      if (window.scrollY > 300) setShow(true)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function dismiss() {
    sessionStorage.setItem('float_cta_dismissed', '1')
    setDismissed(true)
  }

  if (dismissed || !show) return null

  return (
    // Only visible on mobile/tablet (hidden on large screens where there's plenty of space)
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-v-gold text-v-black shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold tracking-widest uppercase">New to KakoBuy?</p>
          <p className="text-xs font-medium truncate opacity-80">
            Register free through our link — supports VAULTED ◆
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href={KAKOBUY_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-v-black text-v-gold text-[11px] font-bold tracking-widest uppercase px-4 py-2 whitespace-nowrap hover:bg-v-surface transition-colors"
          >
            Register →
          </a>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-v-black/50 hover:text-v-black transition-colors text-lg leading-none px-1"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
