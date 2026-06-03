'use client'

import { useState, useEffect } from 'react'
import { KAKOBUY_REGISTER_URL } from '@/config'

export default function TopBanner() {
  const [visible, setVisible] = useState(true)

  // Re-show banner each session
  useEffect(() => {
    const dismissed = sessionStorage.getItem('banner_dismissed')
    if (dismissed) setVisible(false)
  }, [])

  function dismiss() {
    sessionStorage.setItem('banner_dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-v-gold text-v-black">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Message */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[11px] font-bold tracking-widest uppercase hidden sm:block flex-shrink-0">
            ◆ New to KakoBuy?
          </span>
          <p className="text-xs sm:text-[13px] font-medium truncate">
            Register through our link — it&apos;s free, takes 10 seconds, and directly supports VAULTED.
          </p>
        </div>

        {/* CTA + close */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href={KAKOBUY_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-v-black text-v-gold text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-1.5 hover:bg-v-surface transition-colors whitespace-nowrap"
          >
            Register Free →
          </a>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="text-v-black/60 hover:text-v-black transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
