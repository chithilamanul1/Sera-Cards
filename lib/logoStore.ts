import fs from 'fs';
import path from 'path';

declare const globalThis: {
  __sera_logos?: Map<string, string>;
} & typeof global;

if (!globalThis.__sera_logos) {
  globalThis.__sera_logos = new Map<string, string>();
}

export function saveLogo(orderNumber: string, dataUrl: string) {
  if (!orderNumber || !dataUrl) return;

  // 1. In-memory cache
  globalThis.__sera_logos?.set(orderNumber, dataUrl);

  // 2. Try filesystem persistence (local or /tmp)
  try {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      const buffer = Buffer.from(match[2], 'base64');

      // Try /tmp/logos
      const tmpDir = path.join('/tmp', 'logos');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      fs.writeFileSync(path.join(tmpDir, `${orderNumber}.png`), buffer);

      // Try public/uploads/logos if writable
      const publicDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, `${orderNumber}.png`), buffer);
    }
  } catch (err) {
    // Non-critical if filesystem write fails in restricted environments
  }
}

export function getLogoFromMemoryOrDisk(orderNumber: string): { buffer: Buffer; mime: string } | null {
  if (!orderNumber) return null;

  // 1. Check in-memory
  const dataUrl = globalThis.__sera_logos?.get(orderNumber);
  if (dataUrl) {
    const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      return {
        mime: match[1],
        buffer: Buffer.from(match[2], 'base64'),
      };
    }
  }

  // 2. Check /tmp
  try {
    const tmpPath = path.join('/tmp', 'logos', `${orderNumber}.png`);
    if (fs.existsSync(tmpPath)) {
      return {
        mime: 'image/png',
        buffer: fs.readFileSync(tmpPath),
      };
    }
  } catch (e) {}

  // 3. Check public/uploads
  try {
    const pubPath = path.join(process.cwd(), 'public', 'uploads', 'logos', `${orderNumber}.png`);
    if (fs.existsSync(pubPath)) {
      return {
        mime: 'image/png',
        buffer: fs.readFileSync(pubPath),
      };
    }
  } catch (e) {}

  return null;
}
