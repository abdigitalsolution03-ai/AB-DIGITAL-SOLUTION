export function sanitize(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;',
  }
  return String(str).replace(/[&<>"'/]/g, s => map[s])
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const result: any = Array.isArray(obj) ? [] : {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') result[key] = sanitize(value)
    else if (value && typeof value === 'object') result[key] = sanitizeObject(value)
    else result[key] = value
  }
  return result
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePhone(phone: string): boolean {
  return /^[\d\s\-+()]{7,20}$/.test(phone)
}

export function validateUrl(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}

export function stripHtml(str: string): string {
  return String(str).replace(/<[^>]*>/g, '')
}
