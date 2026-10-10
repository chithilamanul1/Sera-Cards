import { MaterialId } from '@/types/card';

export interface CardProduct {
  id: string;
  name: string;
  subtitle?: string;
  rangeId: 'all' | 'classic' | 'company' | 'custom' | 'metal' | 'luxury';
  rangeName: string;
  badge: string;
  priceLkr?: number;
  originalPriceLkr?: number;
  discountPercent?: number;
  isCustomQuote?: boolean;
  priceDisplay?: string;
  isBestSeller?: boolean;
  designType: string;
  materialType: string;
  materialId: MaterialId;
  surfaceType: string;
  materialComposition: string;
  weightGrams: number;
  description: string;
  tagline: string;
  bullets: string[];
  specs: {
    dimensions: string;
    thickness: string;
    weight: string;
    chipset: string;
    readDistance: string;
    waterproof: string;
    warranty: string;
    qrFallback: string;
    monthlyFee: string;
  };
  cardDesign: {
    backgroundColor: string;
    backgroundImage?: string;
    textColor: string;
    accentColor: string;
    edgeBorder: string;
    hasLogo: boolean;
    isMetal: boolean;
    isCustomBadge?: boolean;
    previewName?: string;
    previewTitle?: string;
  };
}

export const PRODUCT_RANGES = [
  {
    id: 'all',
    name: 'All Cards',
    description: 'Browse our complete catalog of smart business cards.',
  },
  {
    id: 'classic',
    name: 'UV & Matte Prints',
    badge: 'Popular',
    description: 'Normal UV print (LKR 3,500) and premium Matte & Gloss finishes (LKR 5,000).',
  },
  {
    id: 'custom',
    name: 'Custom Brand',
    badge: 'Bespoke Artwork',
    description: 'Cards with full company logo printing and 100% bespoke graphic design.',
  },
  {
    id: 'metal',
    name: 'Executive Metal & Gold',
    badge: 'Steel & 24K Gold',
    description: 'Solid surgical stainless steel and bespoke 24K mirror gold luxury cards.',
  },
];

export const CARD_PRODUCTS: CardProduct[] = [
  // ─── 1. Normal UV Print Card (LKR 3,500) ───
  {
    id: 'classic-white',
    name: 'Classic UV Print Card',
    subtitle: 'Smart Business Card',
    rangeId: 'classic',
    rangeName: 'UV Series',
    badge: '-22% Off',
    priceLkr: 3500,
    originalPriceLkr: 4500,
    discountPercent: 22,
    designType: 'Fixed UV Print Design',
    materialType: 'Plastic (PVC) Card',
    materialId: 'epic_white',
    surfaceType: 'Standard UV Print',
    materialComposition: 'Fingerprint-resistant Matte PVC Composite with High-Definition UV Print',
    weightGrams: 5,
    tagline: 'Razor-sharp black UV typography on Arctic white composite.',
    description: 'Clean Arctic white composite card featuring razor-sharp UV typography. Includes dynamic cloud profile, QR fallback, and IP68 waterproof rating.',
    bullets: [
      'Fixed UV Print Design with center-aligned typography',
      'Plastic (PVC) durable matte composite',
      'High-speed NXP NTAG215 microchip (0.2s tap)',
      'High-contrast dynamic fallback QR code on back',
      'Zero monthly fees — cloud hosting included for life',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm (Standard Credit Card)',
      thickness: '0.84 mm',
      weight: '5 grams (Lightweight Pocket Fit)',
      chipset: 'NXP NTAG215 (0.2s ultra-fast response)',
      readDistance: '1 – 4 cm native NFC field',
      waterproof: '100% Waterproof & Washable (IP68)',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'Laser-etched high contrast dynamic QR',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#f8fafc',
      backgroundImage: 'radial-gradient(ellipse at 50% 20%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
      textColor: '#09090b',
      accentColor: '#64748b',
      edgeBorder: 'rgba(0,0,0,0.14)',
      hasLogo: false,
      isMetal: false,
      previewName: 'CHAMATH DISSANAYAKE',
      previewTitle: 'MARKETING MANAGER',
    },
  },

  // ─── 2. Premium Matte Card (LKR 5,000) ───
  {
    id: 'classic-black',
    name: 'Premium Matte Card',
    subtitle: 'Smart Business Card',
    rangeId: 'classic',
    rangeName: 'Matte Series',
    badge: 'Popular Matte',
    priceLkr: 5000,
    designType: 'Anti-Fingerprint Matte Print',
    materialType: 'Plastic (PVC) Card',
    materialId: 'epic_black',
    surfaceType: 'Stealth Matte Black',
    materialComposition: 'Anti-glare Stealth Black PVC Composite with Velvet Matte Finish',
    weightGrams: 5,
    tagline: 'Stealth black velvet matte card with bold luminous white typography.',
    description: 'A timeless stealth aesthetic. Carbon black matte surface with crisp, luminous white lettering that makes a dramatic impression the second you hand it over.',
    bullets: [
      'Velvet Matte Finish with luminous white lettering',
      'Plastic (PVC) matte composite, zero fingerprints',
      'High-speed NXP NTAG215 microchip (0.2s tap)',
      'Dynamic fallback QR code laser-etched on reverse',
      'Zero monthly fees — cloud hosting included for life',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm (Standard Credit Card)',
      thickness: '0.84 mm',
      weight: '5 grams',
      chipset: 'NXP NTAG215 (0.2s ultra-fast response)',
      readDistance: '1 – 4 cm native NFC field',
      waterproof: '100% Waterproof & Washable (IP68)',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'High-contrast laser etched dynamic QR',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#090a0d',
      backgroundImage: 'radial-gradient(ellipse at 50% 25%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 75%)',
      textColor: '#ffffff',
      accentColor: '#94a3b8',
      edgeBorder: 'rgba(255,255,255,0.14)',
      hasLogo: false,
      isMetal: false,
      previewName: 'KOSALA FERNANDO',
      previewTitle: 'SOFTWARE ENGINEER',
    },
  },

  // ─── 3. Premium Gloss Card (LKR 5,000) ───
  {
    id: 'gloss-card',
    name: 'Premium Gloss Card',
    subtitle: 'Smart Business Card',
    rangeId: 'classic',
    rangeName: 'Gloss Series',
    badge: 'High Gloss',
    priceLkr: 5000,
    designType: 'Mirror High-Gloss Finish',
    materialType: 'Plastic (PVC) Card',
    materialId: 'matte',
    surfaceType: 'High-Gloss Mirror UV',
    materialComposition: 'Mirror Finish High-Gloss Laminated PVC Composite with UV Top Coat',
    weightGrams: 5,
    tagline: 'Deep lustrous gloss protective coat that amplifies typography and colors.',
    description: 'For professionals who want high shine and visual pop. A deep lustrous gloss protective coat that amplifies typography and colors with brilliant reflective clarity.',
    bullets: [
      'High-Gloss Mirror UV Protective Finish',
      'Vibrant deep-color saturation and sharp contrast',
      'High-speed NXP NTAG215 microchip (0.2s tap)',
      'High-contrast dynamic fallback QR on reverse',
      'Zero monthly fees — cloud hosting included for life',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm (Standard Credit Card)',
      thickness: '0.84 mm',
      weight: '5 grams',
      chipset: 'NXP NTAG215 (0.2s ultra-fast response)',
      readDistance: '1 – 4 cm native NFC field',
      waterproof: '100% Waterproof & Washable (IP68)',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'High-contrast laser etched dynamic QR',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#0c0f1d',
      backgroundImage: 'linear-gradient(135deg, #16192e 0%, #0c0f1d 50%, #1e2442 100%)',
      textColor: '#ffffff',
      accentColor: '#38bdf8',
      edgeBorder: 'rgba(56,189,248,0.3)',
      hasLogo: false,
      isMetal: false,
      previewName: 'SANJAYA PERERA',
      previewTitle: 'CREATIVE DIRECTOR',
    },
  },

  // ─── 4. Full Custom Brand Card (Best Seller, LKR 5,000) ───
  {
    id: 'custom-card',
    name: 'Full Custom Brand Card',
    subtitle: 'Smart Business Card',
    rangeId: 'custom',
    rangeName: 'Bespoke Custom',
    badge: 'Best Seller',
    isBestSeller: true,
    priceLkr: 5000,
    designType: 'Fully Customizable Design',
    materialType: 'Plastic (PVC) Card',
    materialId: 'custom',
    surfaceType: 'Full-Color Custom UV Print',
    materialComposition: 'Edge-to-Edge HD UV Printed PVC Composite with Protective Overcoat',
    weightGrams: 5,
    tagline: '100% bespoke design on both faces — upload your exact artwork or brand colors.',
    description: 'Our top-rated bespoke option. Send us your complete company artwork, custom graphics, or color palette for HD edge-to-edge printing on both front and back.',
    bullets: [
      'Fully Customizable Design (Front & Back)',
      'Plastic (PVC) with scratch-proof UV clear coat',
      'Submit custom vector artwork, photos, or multi-color graphics',
      'Free digital design proof sent to your WhatsApp before printing',
      'Full two-way lead capture & Google Review booster enabled',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm (Standard Credit Card)',
      thickness: '0.84 mm',
      weight: '5 grams',
      chipset: 'NXP NTAG215 (0.2s ultra-fast response)',
      readDistance: '1 – 4 cm native NFC field',
      waterproof: '100% Waterproof & Washable (IP68)',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'High-contrast laser etched dynamic QR',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#13111c',
      backgroundImage: 'linear-gradient(135deg, #1f1b33 0%, #100e18 50%, #291a38 100%)',
      textColor: '#ffffff',
      accentColor: '#a855f7',
      edgeBorder: 'rgba(168,85,247,0.4)',
      hasLogo: false,
      isMetal: false,
      isCustomBadge: true,
      previewName: 'YOUR DESIGN HERE',
      previewTitle: '100% BESPOKE ARTWORK',
    },
  },

  // ─── 5. Company Card (LKR 5,000) ───
  {
    id: 'company-card',
    name: 'Company Card',
    subtitle: 'Smart Business Card',
    rangeId: 'custom',
    rangeName: 'Corporate Series',
    badge: 'Corporate Standard',
    priceLkr: 5000,
    designType: 'Fixed Design with Company Logo',
    materialType: 'Plastic (PVC) Card',
    materialId: 'matte',
    surfaceType: 'Corporate Matte Black',
    materialComposition: 'Dual-Layer Matte PVC with Full Logo Etch',
    weightGrams: 5,
    tagline: 'Prominent corporate logo insignia on front with personal details on back.',
    description: 'Engineered for executive teams, sales reps, and corporate fleets. Features your official full-size company logo centered on the front face.',
    bullets: [
      'Fixed Design featuring official company logo',
      'Plastic (PVC) dual-layer durable composite',
      'Front: Full-size corporate emblem or brand insignia',
      'Back: Employee name, designation & dynamic QR',
      'Central company admin portal compatibility',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm (Standard Credit Card)',
      thickness: '0.84 mm',
      weight: '5 grams',
      chipset: 'NXP NTAG215 (0.2s ultra-fast response)',
      readDistance: '1 – 4 cm native NFC field',
      waterproof: '100% Waterproof & Washable (IP68)',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'High-contrast laser etched dynamic QR',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#0c0d12',
      backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 80%)',
      textColor: '#ffffff',
      accentColor: '#c084fc',
      edgeBorder: 'rgba(255,255,255,0.16)',
      hasLogo: true,
      isMetal: false,
      previewName: 'COMPANY LOGO',
      previewTitle: 'CORPORATE EDITION',
    },
  },

  // ─── 6. Executive Metal Black (LKR 8,500) ───
  {
    id: 'metal-black',
    name: 'Executive Metal Black',
    subtitle: 'Smart Business Card',
    rangeId: 'metal',
    rangeName: 'Executive Metal',
    badge: 'Heavy Metal 22g',
    priceLkr: 8500,
    originalPriceLkr: 9990,
    discountPercent: 15,
    designType: 'Laser-Etched Design',
    materialType: 'Solid Surgical Steel (22g)',
    materialId: 'metal_black',
    surfaceType: 'Surgical 304 Stainless Steel',
    materialComposition: 'Surgical Grade 304 Stainless Steel with Anodized Stealth PVD',
    weightGrams: 22,
    tagline: 'Substantial 22g surgical stainless steel with diamond laser-etched typography.',
    description: 'Weighing a heavy 22 grams, this solid surgical stainless steel card commands respect in every meeting. Features precision fiber-laser text etching that never wears out.',
    bullets: [
      'Laser-Etched Design into solid stainless steel',
      'Solid Surgical Steel (22g) with matte black PVD coating',
      'Heavy executive hand feel with cool metallic touch',
      'Dynamic QR code permanently laser-etched into the metal',
      'Includes luxury velvet presentation sleeve',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm × 0.8mm',
      thickness: '0.80 mm solid metal',
      weight: '22 grams (Substantial Heavy Feel)',
      chipset: 'Embedded High-Coercivity NTAG215 Chip',
      readDistance: '1 – 3 cm specialized metallic antenna',
      waterproof: 'Corrosion-proof 304 Stainless Steel',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'Permanent laser-etched metal QR code',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#0f1013',
      backgroundImage: 'linear-gradient(135deg, #18191d 0%, #0c0d0f 50%, #1e1f24 100%)',
      textColor: '#f1f5f9',
      accentColor: '#a1a1aa',
      edgeBorder: 'rgba(255,255,255,0.28)',
      hasLogo: false,
      isMetal: true,
      previewName: 'CHITHILA MANUL',
      previewTitle: 'MANAGING DIRECTOR',
    },
  },

  // ─── 7. Custom 24K Gold Card (WITHOUT A FIXED PRICE — Custom Quote) ───
  {
    id: 'metal-gold-24k',
    name: 'Custom 24K Gold Card',
    subtitle: 'Bespoke Luxury Smart Card',
    rangeId: 'metal',
    rangeName: 'Executive Metal',
    badge: 'VIP 24K Gold',
    isBestSeller: true,
    isCustomQuote: true,
    priceDisplay: 'Price on Request',
    designType: 'Bespoke 24K Mirror Gold & Diamond Etch',
    materialType: 'Solid Metal & Electroplated 24K Gold',
    materialId: 'gold',
    surfaceType: '24K Electroplated Mirror Gold',
    materialComposition: 'Electroplated 24K Mirror Gold on Surgical Steel Core',
    weightGrams: 25,
    tagline: 'The ultimate symbol of prestige — 25g electroplated 24K mirror gold custom crafted to order.',
    description: 'Custom-crafted to order. Heavy 25-gram surgical steel core electroplated in authentic 24K mirror gold, detailed with precision diamond-point laser engraving of your custom emblem or personal wordmark. Quotation provided upon consultation.',
    bullets: [
      '24K Electroplated Mirror Gold with authentic specular reflection',
      'Bespoke quotation tailored to your custom specifications',
      'Substantial 25g ultra-heavy executive weight',
      'Precision diamond-point laser engraving of your logo & name',
      'Presented in handcrafted executive gift box',
    ],
    specs: {
      dimensions: '85.6mm × 53.98mm × 0.85mm',
      thickness: '0.85 mm electroplated gold',
      weight: '25 grams (Ultra-Heavy Executive Weight)',
      chipset: 'Embedded Gold-Tuned NXP NTAG215 Chip',
      readDistance: '1 – 3 cm specialized metallic antenna',
      waterproof: 'Tarnish-Proof Electroplated 24K Gold',
      warranty: '1-Year Full Replacement Guarantee',
      qrFallback: 'Diamond laser-etched permanent QR code',
      monthlyFee: 'Rs. 0 / month (Free Lifetime Hosting)',
    },
    cardDesign: {
      backgroundColor: '#ca8a04',
      backgroundImage: 'linear-gradient(135deg, #fef08a 0%, #eab308 30%, #ca8a04 60%, #fef08a 85%, #a16207 100%)',
      textColor: '#1c1917',
      accentColor: '#78350f',
      edgeBorder: 'rgba(234,179,8,0.5)',
      hasLogo: false,
      isMetal: true,
      previewName: 'CHITHILA MANUL',
      previewTitle: 'FOUNDER & CEO',
    },
  },
];
