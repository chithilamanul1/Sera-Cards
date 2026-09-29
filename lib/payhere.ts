import crypto from 'crypto';

export interface PayHereCheckoutParams {
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string; // e.g. "3850.00"
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
}

export const PAYHERE_CONFIG = {
  merchantId: process.env.PAYHERE_MERCHANT_ID || '248247',
  merchantSecret: process.env.PAYHERE_MERCHANT_SECRET || '',
  isSandbox: process.env.PAYHERE_MODE === 'sandbox',
  currency: 'LKR',
  get checkoutUrl() {
    return this.isSandbox
      ? 'https://sandbox.payhere.lk/pay/checkout'
      : 'https://www.payhere.lk/pay/checkout';
  },
};

/**
 * Generate PayHere security hash for checkout
 * Formula: strtoupper(md5(merchant_id + order_id + number_format(amount, 2, '.', '') + currency + strtoupper(md5(merchant_secret))))
 */
export function generatePayHereHash(orderId: string, amount: number): string {
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: false,
  });

  const hashedSecret = crypto
    .createHash('md5')
    .update(PAYHERE_CONFIG.merchantSecret)
    .digest('hex')
    .toUpperCase();

  const hashString = `${PAYHERE_CONFIG.merchantId}${orderId}${formattedAmount}${PAYHERE_CONFIG.currency}${hashedSecret}`;

  return crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase();
}

/**
 * Verify PayHere Instant Payment Notification (IPN) signature
 * Formula: strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))
 */
export function verifyPayHereNotification(body: {
  merchant_id: string;
  order_id: string;
  payhere_amount: string;
  payhere_currency: string;
  status_code: string;
  md5sig: string;
}): boolean {
  try {
    const hashedSecret = crypto
      .createHash('md5')
      .update(PAYHERE_CONFIG.merchantSecret)
      .digest('hex')
      .toUpperCase();

    const hashString = `${body.merchant_id}${body.order_id}${body.payhere_amount}${body.payhere_currency}${body.status_code}${hashedSecret}`;

    const localMd5Sig = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    return localMd5Sig === body.md5sig?.toUpperCase();
  } catch (err) {
    console.error('Error verifying PayHere signature:', err);
    return false;
  }
}
