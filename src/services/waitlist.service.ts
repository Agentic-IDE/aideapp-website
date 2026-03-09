import type { WaitlistFormData, WaitlistResponse } from '../types'

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export async function submitWaitlist(data: WaitlistFormData): Promise<WaitlistResponse> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/waitlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to submit')
    return res.json()
  }

  // localStorage stub
  const existing = JSON.parse(localStorage.getItem('waitlist') || '[]') as string[]
  if (!existing.includes(data.email)) {
    existing.push(data.email)
    localStorage.setItem('waitlist', JSON.stringify(existing))
  }
  return { success: true, message: "You're on the list!" }
}
