import type { ContactFormData, WaitlistResponse } from '../types'

export async function submitContact(data: ContactFormData): Promise<WaitlistResponse> {
  if (import.meta.env.DEV) {
    const existing = JSON.parse(localStorage.getItem('contact') || '[]') as ContactFormData[]
    existing.push(data)
    localStorage.setItem('contact', JSON.stringify(existing))
    return { success: true, message: 'Message sent!' }
  }

  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit')
  return res.json()
}
