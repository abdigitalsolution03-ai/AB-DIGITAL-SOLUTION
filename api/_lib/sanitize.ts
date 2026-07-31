export function sanitize(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return String(str).replace(/[&<>"'/]/g, (s) => map[s])
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]{7,20}$/.test(phone)
}

export function stripHtml(str: string): string {
  return String(str).replace(/<[^>]*>/g, '')
}
