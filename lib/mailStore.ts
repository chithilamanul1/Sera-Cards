export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  type: 'ACTIVATION' | 'ORDER' | 'PROVISION' | 'LEAD' | 'TEST';
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  error?: string;
  preview: string;
  html: string;
  timestamp: string;
}

declare const globalThis: {
  __gosera_email_logs?: EmailLog[];
} & typeof global;

function getStore(): EmailLog[] {
  if (!globalThis.__gosera_email_logs) {
    globalThis.__gosera_email_logs = [];
  }
  return globalThis.__gosera_email_logs;
}

/**
 * Save an email dispatch record into the audit log
 */
export function saveEmailLog(log: EmailLog): void {
  const store = getStore();
  // Keep the latest 100 emails
  store.unshift(log);
  if (store.length > 100) {
    store.pop();
  }
}

/**
 * Get all logged emails (most recent first)
 */
export function getAllEmailLogs(): EmailLog[] {
  return [...getStore()];
}

/**
 * Get email logs for a specific recipient email
 */
export function getEmailLogsByRecipient(email: string): EmailLog[] {
  const clean = email.toLowerCase().trim();
  return getStore().filter((log) => log.to.toLowerCase().includes(clean));
}

/**
 * Clear email logs
 */
export function clearEmailLogs(): void {
  const store = getStore();
  store.length = 0;
}
