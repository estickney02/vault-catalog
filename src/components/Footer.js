import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-v-dark border-t border-v-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-[0.3em] text-v-text hover:text-v-gold transition-colors"
            >
              VAULTED
            </Link>
            <p className="mt-3 text-v-muted text-sm leading-relaxed">
              The vault is open.
              <br />
              Hand-picked designer reps and quality finds, all in one place.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="section-label mb-4">Navigate</p>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm link-gold">
                Home
              </Link>
              <Link href="/shop" className="text-sm link-gold">
                Shop All
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <p className="section-label mb-4">Follow</p>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm link-gold"
              >
                Instagram ↗
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm link-gold"
              >
                TikTok ↗
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-v-border pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-v-muted text-xs">
            © {new Date().getFullYear()} VAULTED. All rights reserved.
          </p>
          <p className="text-v-muted text-xs max-w-md text-right leading-relaxed">
            Some links on this site are affiliate links. We may earn a commission at no extra cost to
            you.
          </p>
        </div>
      </div>
    </footer>
  )
}
