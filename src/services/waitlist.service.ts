import type { WaitlistFormData, WaitlistResponse } from '../types'

export async function submitWaitlist(data: WaitlistFormData): Promise<WaitlistResponse> {
  if (import.meta.env.DEV) {
    // localStorage stub for local development
    const existing = JSON.parse(localStorage.getItem('waitlist') || '[]') as string[]
    if (!existing.includes(data.email)) {
      existing.push(data.email)
      localStorage.setItem('waitlist', JSON.stringify(existing))
    }
    return { success: true, message: "You're on the list!" }
  }

  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to submit')
  return res.json()
}
