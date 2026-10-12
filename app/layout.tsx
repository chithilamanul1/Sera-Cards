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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'),
  title: {
    default: 'Sera Cards — Smart NFC Business Cards Sri Lanka | GoSera',
    template: '%s | Sera Cards Sri Lanka',
  },
  description:
    "Upgrade your networking with Sera Cards — Sri Lanka's leading smart NFC business cards. Share your contact with 1 tap, capture two-way client leads, accept LankaQR payments, and track tap analytics. Free island-wide delivery.",
  keywords: [
    'NFC business cards Sri Lanka',
    'Sera Cards',
    'GoSera',
    'smart business cards Colombo',
    'digital visiting card Sri Lanka',
    'NFC smart business cards',
    'LankaQR NFC card',
    'executive metal business card Sri Lanka',
    'digital business cards Colombo',
    'lead capture business cards',
    'custom printed NFC cards Sri Lanka',
    'smart NFC cards Kandy Galle Colombo',
    'two-way contact exchange',
    'Seranex',
    'NTAG215 business card Sri Lanka',
  ],
  authors: [{ name: 'Seranex (Pvt) Ltd', url: 'https://seranex.lk' }],
  creator: 'Seranex',
  publisher: 'Sera Cards',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://seranex.lk',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Sera Cards — Smart NFC Business Cards & Networking Platform Sri Lanka',
    description:
      "One tap delivers your entire professional identity. Capture client leads, accept LankaQR payments, and track real-time analytics with Sri Lanka's premier NFC card.",
    url: 'https://seranex.lk',
    siteName: 'Sera Cards',
    locale: 'en_LK',
    type: 'website',
    images: [
      {
        url: '/card-mockup.png',
        width: 1200,
        height: 630,
        alt: 'Sera Cards — Smart NFC Business Cards Sri Lanka',
      },
      {
        url: '/logo-white.png',
        width: 800,
        height: 800,
        alt: 'Sera Cards Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sera Cards — Smart NFC Business Cards Sri Lanka',
    description:
      'One tap delivers your entire professional profile. Two-way lead capture, LankaQR payments, and real-time tap analytics with free island-wide delivery.',
    images: ['/card-mockup.png'],
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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seranex.lk'

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Sera Cards',
        alternateName: ['GoSera', 'Seranex Cards'],
        url: baseUrl,
        logo: `${baseUrl}/logo-white.png`,
        description:
          "Sri Lanka's leading smart NFC digital business card and conversion networking platform.",
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 20 A Amuna Rd',
          addressLocality: 'Seeduwa',
          addressRegion: 'Western Province',
          postalCode: '11410',
          addressCountry: 'LK',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+94728382638',
          contactType: 'sales and customer service',
          areaServed: 'LK',
          availableLanguage: ['English', 'Sinhala'],
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${baseUrl}/#localbusiness`,
        name: 'Sera Cards Sri Lanka',
        image: `${baseUrl}/logo-white.png`,
        telephone: '+94728382638',
        email: 'info@seranex.lk',
        url: baseUrl,
        priceRange: 'LKR 3,500 - LKR 10,000',
        currenciesAccepted: 'LKR',
        paymentAccepted: 'Cash, Bank Transfer, LankaQR, Mintpay, Credit Card',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 20 A Amuna Rd',
          addressLocality: 'Seeduwa',
          addressRegion: 'Western Province',
          postalCode: '11410',
          addressCountry: 'LK',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 7.1264,
          longitude: 79.8821,
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '08:00',
          closes: '22:00',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'Sera Cards',
        publisher: { '@id': `${baseUrl}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'GoSera Networking Engine',
        image: `${baseUrl}/logo-white.png`,
        description:
          "Smart NFC digital profile system with lead capture, tap analytics, and LankaQR integration.",
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web, iOS, Android',
        brand: {
          '@type': 'Brand',
          name: 'Sera Cards',
        },
        offers: [
          {
            '@type': 'Offer',
            name: 'Classic White NFC Card',
            price: '3500',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Full Custom Brand NFC Card',
            price: '5000',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'Executive Metal NFC Card',
            price: '10000',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
          {
            '@type': 'Offer',
            name: 'GoSera Pro Annual Plan',
            price: '2400',
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/pricing`,
          },
        ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full bg-zinc-950 text-white selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}
