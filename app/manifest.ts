import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sera Cards — Smart NFC Business Cards',
    short_name: 'Sera Cards',
    description: "Sri Lanka's leading smart NFC business cards and digital networking platform.",
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0c',
    theme_color: '#0a0a0c',
    icons: [
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-white.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
