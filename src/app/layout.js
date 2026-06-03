import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TopBanner from '@/components/TopBanner'
import FloatingRegisterCTA from '@/components/FloatingRegisterCTA'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'VAULTED — The vault is open.',
  description: 'Curated designer finds and reps. Shop the best KakoBuy picks, hand-selected for quality and style.',
  keywords: 'vault, reps, finds, kakobuy, designer, fashion, curated',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-v-black text-v-text min-h-screen flex flex-col">
        <TopBanner />
        <div className="pt-9">
          <Navbar />
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingRegisterCTA />
      </body>
    </html>
  )
}
