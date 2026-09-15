export const brand = {
  name: 'Sera Cards',
  domain: 'seranex.lk',
  whatsapp: '94728382638',
  phone: '0728382638',
  email: 'info@seranex.lk',
  address: 'No. 20 A Amuna Rd. Seeduwa',
  priceLkr: 3500,
}

export interface Step {
  title: string
  body: string
  detail: string
}

export const steps: Step[] = [
  {
    title: 'Tap or Scan',
    body: 'Hold your Sera Card near any modern smartphone, or scan the custom dynamic QR code printed on the back.',
    detail: '0.2s response',
  },
  {
    title: 'Instant Profile Load',
    body: 'Your branded microsite (yourname.seranex.lk) launches instantly in their native browser — zero apps or downloads needed.',
    detail: 'No app required',
  },
  {
    title: 'Connect & Convert',
    body: 'Your prospect saves your contact with a single tap, sends their details back to you, or completes a direct payment via LankaQR.',
    detail: '1-tap save',
  },
]

export interface ComparisonRow {
  feature: string
  paper: string
  sera: string
}

export const comparison: ComparisonRow[] = [
  {
    feature: 'Information updates',
    paper: 'Costly reprints every time a number or address changes.',
    sera: 'Instant real-time updates via your Sera cloud portal.',
  },
  {
    feature: 'Contact saving',
    paper: 'Manual, error-prone typing that often results in lost leads.',
    sera: '1-tap direct address book save (.vcf).',
  },
  {
    feature: 'Capacity',
    paper: 'Strictly limited to a 2 × 3-inch print space.',
    sera: 'Unlimited: links, catalogs, PDFs, social media, LankaQR.',
  },
  {
    feature: 'Sustainability',
    paper: 'Heavy paper waste; 88% are discarded within a week.',
    sera: 'Eco-friendly; one durable card engineered for life.',
  },
  {
    feature: 'Lead generation',
    paper: 'One-way handout with no follow-up tracking.',
    sera: 'Two-way contact exchange captures prospect details.',
  },
]

export interface Feature {
  title: string
  body: string
  icon: 'exchange' | 'payment' | 'review' | 'identity' | 'lock'
  featured?: boolean
}

export const features: Feature[] = [
  {
    title: 'Two-Way Lead Exchange',
    body: 'Never lose a contact again. When someone views your card, an embedded form lets them send their name and WhatsApp number straight to your inbox.',
    icon: 'exchange',
    featured: true,
  },
  {
    title: 'Integrated LankaQR Payments',
    body: 'Accept payments on the spot. Display your official LankaQR and bank details alongside your profile for zero-friction transactions.',
    icon: 'payment',
  },
  {
    title: 'Google Review Booster',
    body: 'Accelerate your reputation. Route clients directly to your 5-star Google review prompt with a single tap.',
    icon: 'review',
  },
  {
    title: 'Custom Dynamic Identity',
    body: 'Claim your professional presence with a dedicated URL under seranex.lk, customizable whenever your business grows.',
    icon: 'identity',
  },
  {
    title: 'Remote Card Lock',
    body: 'Misplaced your card? Freeze profile access instantly from your admin dashboard until it is safely back in your hands.',
    icon: 'lock',
  },
]

export interface Spec {
  label: string
  value: string
  body: string
}

export const specs: Spec[] = [
  {
    label: 'Chipset',
    value: 'NXP NTAG215',
    body: 'High-performance chip with a 0.2-second response latency — one tap, no waiting, no second attempt.',
  },
  {
    label: 'Read range',
    value: '1 – 3 cm',
    body: 'Standard NFC field, so the card reads the moment it meets the top of the handset.',
  },
  {
    label: 'Durability',
    value: 'Matte PVC composite',
    body: 'Water-resistant and bend-tolerant, engineered to survive years of pockets and wallets.',
  },
  {
    label: 'Fallback system',
    value: 'Dynamic QR code',
    body: 'High-contrast laser-etched dynamic QR on the card reverse, opening the exact same profile.',
  },
]

export const packageIncludes = [
  'Custom printed logo and name, both faces',
  'Your own sub-page at [slug].seranex.lk',
  'Dynamic cloud portal — edit details anytime',
  'Two-way lead exchange inbox',
  'LankaQR & bank payment block',
  'Laser-etched dynamic QR on the reverse',
  'Free island-wide delivery',
  'One-time purchase, zero monthly fees',
]

export interface FaqItem {
  q: string
  a: string
}

export const faqs: FaqItem[] = [
  {
    q: 'Does the other person need an app to view my card?',
    a: 'No. Sera Cards utilize native NFC protocols built into iOS and Android devices. Tapping the card automatically opens your profile in their default browser.',
  },
  {
    q: 'What happens if an older phone does not support NFC?',
    a: 'Every Sera Card features an integrated, high-contrast dynamic QR code on the back that opens the exact same digital profile using any standard phone camera.',
  },
  {
    q: 'Can I update my details after purchasing the card?',
    a: 'Yes. Your card links directly to your dedicated cloud sub-profile. You can update your phone numbers, portfolio links, and files anytime through your administrative portal without changing the physical card.',
  },
]
