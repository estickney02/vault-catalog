import Link from 'next/link'
import { readJson } from '@/lib/blobDb'

export default async function Footer() {
  const s = await readJson('settings', { instagramUrl: '', tiktokUrl: '' })

  return (
    <footer className="bg-emf-black text-emf-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <Link href="/" className="font-script text-3xl text-emf-ivory hover:text-emf-pink transition-colors leading-none block mb-4">
              Emoney Finds
            </Link>
            <p className="font-display text-emf-ivory/50 text-sm leading-relaxed">
              All the looks. None of the search.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-display text-[10px] tracking-[0.3em] uppercase text-emf-pink mb-5">Navigate</p>
            <div className="flex flex-col gap-3">
              {['/', '/shop', '/#categories', '/#how-it-works'].map((href, i) => (
                <Link key={href} href={href}
                  className="font-display text-sm text-emf-ivory/60 hover:text-emf-pink transition-colors">
                  {['Home','Shop','Categories','How It Works'][i]}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="font-display text-[10px] tracking-[0.3em] uppercase text-emf-pink mb-5">Follow</p>
            <div className="flex flex-col gap-3">
              {s.instagramUrl && (
                <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="font-display text-sm text-emf-ivory/60 hover:text-emf-pink transition-colors">
                  Instagram ↗
                </a>
              )}
              {s.tiktokUrl && (
                <a href={s.tiktokUrl} target="_blank" rel="noopener noreferrer"
                  className="font-display text-sm text-emf-ivory/60 hover:text-emf-pink transition-colors">
                  TikTok ↗
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-emf-ivory/10 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-display text-emf-ivory/30 text-xs">© 2025 EMONEY FINDS. All rights reserved.</p>
          <p className="font-display text-emf-ivory/30 text-xs max-w-sm md:text-right leading-relaxed">
            Affiliate Disclosure: Links on this site are KakoBuy affiliate links. We may earn a commission at no cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}
