import { put, list } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const BLOB_PATH = 'waitlist/emails.json'

interface WaitlistEntry {
  email: string
  created_at: string
}

async function getEmails(): Promise<WaitlistEntry[]> {
  const { blobs } = await list({ prefix: BLOB_PATH })
  if (blobs.length === 0) return []
  const res = await fetch(blobs[0].url)
  return res.json()
}

async function saveEmails(entries: WaitlistEntry[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(entries), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { email } = req.body as { email?: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' })
    }

    try {
      const entries = await getEmails()
      if (entries.some((e) => e.email === email)) {
        return res.status(200).json({ success: true, message: "You're on the list!" })
      }
      entries.unshift({ email, created_at: new Date().toISOString() })
      await saveEmails(entries)
      return res.status(200).json({ success: true, message: "You're on the list!" })
    } catch (err) {
      console.error('Waitlist insert error:', err)
      return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
  }

  if (req.method === 'GET') {
    try {
      const entries = await getEmails()
      return res.status(200).json({ emails: entries })
    } catch (err) {
      console.error('Waitlist fetch error:', err)
      return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
