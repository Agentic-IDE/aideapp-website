import { put, list } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const BLOB_PATH = 'contact/messages.json'

interface ContactEntry {
  email: string
  message?: string
  created_at: string
}

async function getMessages(): Promise<ContactEntry[]> {
  const { blobs } = await list({ prefix: BLOB_PATH })
  if (blobs.length === 0) return []
  const res = await fetch(blobs[0].url)
  return res.json()
}

async function saveMessages(entries: ContactEntry[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(entries), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { email, message } = req.body as { email?: string; message?: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' })
    }

    try {
      const entries = await getMessages()
      entries.unshift({ email, message, created_at: new Date().toISOString() })
      await saveMessages(entries)
      return res.status(200).json({ success: true, message: 'Message sent!' })
    } catch (err) {
      const detail = err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : String(err)
      console.error('Blob storage error:', detail)
      return res.status(500).json({ success: false, message: 'Something went wrong', detail })
    }
  }

  if (req.method === 'GET') {
    try {
      const entries = await getMessages()
      return res.status(200).json({ messages: entries })
    } catch (err) {
      const detail = err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : String(err)
      console.error('Contact fetch error:', detail)
      return res.status(500).json({ success: false, message: 'Something went wrong', detail })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
