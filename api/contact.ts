import { Resend } from 'resend'
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
      // Store in blob first (guaranteed persistence)
      const entries = await getMessages()
      entries.unshift({ email, message, created_at: new Date().toISOString() })
      await saveMessages(entries)
    } catch (err) {
      console.error('Blob storage error:', err)
      return res.status(500).json({ success: false, message: 'Something went wrong' })
    }

    // Attempt email via Resend (non-blocking — data is already saved)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Agentic IDE <contact@send.aideapp.dev>',
        to: process.env.CONTACT_EMAIL!,
        subject: `New contact from ${email}`,
        text: `Email: ${email}\n${message ? `Message: ${message}` : '(No message)'}`,
      })
    } catch (err) {
      console.error('Resend email error:', err)
      // Don't fail the request — message is already stored in blob
    }

    return res.status(200).json({ success: true, message: 'Message sent!' })
  }

  if (req.method === 'GET') {
    try {
      const entries = await getMessages()
      return res.status(200).json({ messages: entries })
    } catch (err) {
      console.error('Contact fetch error:', err)
      return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
