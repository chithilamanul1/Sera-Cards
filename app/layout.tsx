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
    default: 'GoSera — Smart NFC Business Cards & Networking Platform Sri Lanka',
    template: '%s | GoSera',
  },
  description:
    "GoSera is Sri Lanka's smart NFC networking platform. Get an NFC business card, build your digital profile, capture leads with two-way exchange, and track analytics — free plan available.",
  keywords: [
    'NFC business card Sri Lanka',
    'GoSera',
    'smart business cards Colombo',
    'digital business cards Sri Lanka',
    'lead capture NFC card',
    'Seranex',
    'smart NFC cards',
    'PVC NFC cards Sri Lanka',
    'two-way contact exchange',
    'LankaQR business card',
    'networking platform Sri Lanka',
    'subscription business card',
  ],
  authors: [{ name: 'Seranex', url: 'https://seranex.lk' }],
  creator: 'Seranex',
  publisher: 'GoSera',
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
    title: 'GoSera — Smart NFC Business Cards & Networking Platform',
    description:
      "One tap delivers your entire professional identity. Capture leads, track analytics, and grow your network with GoSera — Sri Lanka's smart NFC networking platform.",
    url: 'https://card.seranex.lk',
    siteName: 'GoSera',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/logo-white.png',
        width: 800,
        height: 800,
        alt: 'GoSera — Smart NFC Networking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoSera — Smart NFC Business Cards Sri Lanka',
    description:
      'One tap. Capture leads, track analytics, grow your network. NFC cards from LKR 1,500 + free software plan.',
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
    '@type': 'SoftwareApplication',
    name: 'GoSera — Smart NFC Networking Platform',
    image: 'https://card.seranex.lk/logo-white.png',
    description:
      "GoSera is Sri Lanka's smart NFC networking platform. Get an NFC business card, capture leads with two-way exchange, and track analytics.",
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web, iOS, Android',
    brand: {
      '@type': 'Brand',
      name: 'GoSera by Seranex',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Standard Matte PVC Card (Hardware)',
        price: '1500',
        priceCurrency: 'LKR',
        availability: 'https://schema.org/InStock',
        url: 'https://card.seranex.lk/pricing',
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        name: 'GoSera Pro (Annual Subscription)',
        price: '2400',
        priceCurrency: 'LKR',
        availability: 'https://schema.org/InStock',
        url: 'https://card.seranex.lk/pricing',
        priceValidUntil: '2027-12-31',
      },
      {
        '@type': 'Offer',
        name: 'GoSera Teams (Annual per user)',
        price: '4800',
        priceCurrency: 'LKR',
        availability: 'https://schema.org/InStock',
        url: 'https://card.seranex.lk/teams',
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
