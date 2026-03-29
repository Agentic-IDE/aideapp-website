/** Client-side input validation — mirrors backend sanitize.ts */

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim()
  if (trimmed.length === 0 || trimmed.length > 255) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

export function sanitizeName(name: string, maxLength = 100): string {
  return name.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function validateName(name: string): string | null {
  const clean = sanitizeName(name)
  if (clean.length === 0) return 'Name is required'
  if (clean.length < 2) return 'Name must be at least 2 characters'
  return null
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required'
  if (!isValidEmail(email)) return 'Invalid email format'
  return null
}
