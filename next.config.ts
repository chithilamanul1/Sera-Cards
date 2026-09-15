import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Allow wildcard subdomains for seranex.lk and serenex.lk
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}

export default nextConfig
