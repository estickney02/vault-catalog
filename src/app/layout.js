import { Pinyon_Script, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navbar      from '@/components/Navbar'
import Footer      from '@/components/Footer'
import TopBanner   from '@/components/TopBanner'

const pinyon = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pinyon',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'EMONEY FINDS — All the looks. None of the search.',
  description: 'Premium curated finds from KakoBuy — organized so you can actually shop.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pinyon.variable} ${playfair.variable}`}>
      <body className="bg-emf-ivory text-emf-black min-h-screen flex flex-col">
        <TopBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
