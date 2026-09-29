import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0c',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://card.seranex.lk'),
  title: {
    default: 'Sera Cards — Smart NFC Business Cards Sri Lanka',
    template: '%s | Sera Cards',
  },
  description:
    'The premier smart NFC business cards in Sri Lanka. One tap shares your contact, social links, LankaQR payments, and two-way lead capture. Custom PVC prints with 0.2s instant response. Island-wide delivery.',
  keywords: [
    'NFC business card Sri Lanka',
    'smart business cards Colombo',
    'digital business cards Sri Lanka',
    'Sera Cards',
    'Seranex',
    'smart NFC cards',
    'PVC NFC cards Sri Lanka',
    'two-way contact exchange',
    'LankaQR business card',
    'contactless digital card',
  ],
  authors: [{ name: 'Seranex', url: 'https://seranex.lk' }],
  creator: 'Seranex',
  publisher: 'Sera Cards',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Sera Cards — Smart NFC Business Cards Sri Lanka',
    description:
      'One tap delivers your entire professional identity to any smartphone. Powered by high-speed NTAG215 NFC and dynamic cloud profiles — no app required. Island-wide delivery.',
    url: 'https://card.seranex.lk',
    siteName: 'Sera Cards',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo-white.png',
        width: 800,
        height: 800,
        alt: 'Sera Cards — Smart NFC Business Cards',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sera Cards — Smart NFC Business Cards Sri Lanka',
    description:
      'One tap. Your entire professional identity. Durable PVC NFC cards with instant cloud profile, LankaQR & 2-way lead exchange.',
    images: ['/logo-white.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Sera Smart NFC Business Card',
    image: 'https://card.seranex.lk/logo-white.png',
    description:
      'Durable custom-printed smart NFC business card in Sri Lanka. One-tap instant contact sharing, custom digital profile, LankaQR integration, and two-way lead capture.',
    brand: {
      '@type': 'Brand',
      name: 'Sera Cards',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Sera Signature PVC Edition',
        price: '3500',
        priceCurrency: 'LKR',
        availability: 'https://schema.org/InStock',
        url: 'https://card.seranex.lk',
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        name: 'Full Custom Print PVC Edition',
        price: '5000',
        priceCurrency: 'LKR',
        availability: 'https://schema.org/InStock',
        url: 'https://card.seranex.lk',
        priceValidUntil: '2027-12-31',
      },
    ],
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${quicksand.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-zinc-950 text-white selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  )
}
