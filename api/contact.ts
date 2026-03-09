import { put, list, getDownloadUrl } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const BLOB_PATH = 'contact/messages.json'
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

const ipHits = new Map<string, number[]>()

interface ContactEntry {
  email: string
  message?: string
  created_at: string
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  if (hits.length >= RATE_LIMIT_MAX) return true
  hits.push(now)
  ipHits.set(ip, hits)
  return false
}

async function getMessages(): Promise<ContactEntry[]> {
  const { blobs } = await list({ prefix: BLOB_PATH })
  if (blobs.length === 0) return []
  const downloadUrl = await getDownloadUrl(blobs[0].url)
  const res = await fetch(downloadUrl)
  return res.json()
}

async function saveMessages(entries: ContactEntry[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(entries), {
    access: 'private',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'POST') {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return res.status(429).json({ success: false, message: 'Too many requests. Try again later.' })
    }

    const { email, message } = req.body as { email?: string; message?: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' })
    }

    const cleanEmail = sanitize(email).slice(0, 254)
    const cleanMessage = message ? sanitize(message).slice(0, 2000) : undefined

    try {
      const entries = await getMessages()
      entries.unshift({ email: cleanEmail, message: cleanMessage, created_at: new Date().toISOString() })
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
