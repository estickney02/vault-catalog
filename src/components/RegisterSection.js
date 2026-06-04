'use client'

import { QRCodeSVG } from 'qrcode.react'
import { KAKOBUY_REGISTER_URL } from '@/config'

export default function RegisterSection() {
  return (
    <section className="relative overflow-hidden border-y border-v-gold/30 bg-[#0f0d08]">
      {/* Gold glow blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-v-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-v-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Text side */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="section-label mb-3">Support EMONEYFINDS</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Register on KakoBuy<br />
                <span className="text-v-gold">through our link.</span>
              </h2>
            </div>

            <p className="text-v-muted text-base leading-relaxed">
              KakoBuy is the platform where every product on this site is sourced from.
              Creating a free account through our link costs you <span className="text-v-text font-medium">nothing</span> — but
              it&apos;s the single biggest way to support EMONEYFINDS and keep this catalog running.
            </p>

            <ul className="flex flex-col gap-3">
              {[
                'Completely free to register — no payment required',
                'Takes less than 60 seconds',
                'Unlock access to thousands of finds',
                'Directly keeps this catalog free for everyone',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-v-muted">
                  <span className="text-v-gold mt-0.5 flex-shrink-0">◆</span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href={KAKOBUY_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-center text-sm"
              >
                Create Free Account →
              </a>
            </div>

            <p className="text-v-muted/50 text-xs">
              Already have an account? No worries — just click the &ldquo;Shop on KakoBuy&rdquo; buttons above to browse.
            </p>
          </div>

          {/* QR Code side */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-5 rounded-sm">
              <QRCodeSVG
                value={KAKOBUY_REGISTER_URL}
                size={200}
                bgColor="#ffffff"
                fgColor="#0a0a0a"
                level="M"
              />
            </div>
            <div className="text-center">
              <p className="text-v-text font-semibold tracking-wide text-sm">Scan to Register</p>
              <p className="text-v-muted text-xs mt-1">
                On your phone? Scan with your camera app
              </p>
            </div>

            {/* Visual trust signal */}
            <div className="w-full border border-v-border bg-v-surface px-5 py-4 text-center">
              <p className="text-v-gold text-xs font-bold tracking-[0.2em] uppercase mb-1">
                Why register?
              </p>
              <p className="text-v-muted text-xs leading-relaxed">
                Every registration through our link directly funds EMONEYFINDS — no ads, no paywalls, just the finds.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
