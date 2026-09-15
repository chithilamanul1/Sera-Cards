import type { Metadata } from 'next'
import { Inter, Instrument_Serif, Quicksand } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sera Cards — Smart NFC Business Cards Sri Lanka',
  description:
    'One tap delivers your entire professional identity to any smartphone. Powered by NFC and dynamic cloud profiles — no apps required. Free island-wide delivery.',
  keywords: ['NFC business card', 'digital business card', 'Sri Lanka', 'Seranex', 'smart card'],
  openGraph: {
    title: 'Sera Cards — The Last Business Card You Will Ever Need',
    description: 'One tap. Your entire professional identity. Powered by NFC.',
    url: 'https://card.seranex.lk',
    siteName: 'Sera Cards',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${quicksand.variable} h-full`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  )
}
