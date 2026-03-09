import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_emails (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { email } = req.body as { email?: string }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' })
    }

    try {
      await ensureTable()
      await sql`INSERT INTO waitlist_emails (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING`
      return res.status(200).json({ success: true, message: "You're on the list!" })
    } catch (err) {
      console.error('Waitlist insert error:', err)
      return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
  }

  if (req.method === 'GET') {
    try {
      await ensureTable()
      const { rows } = await sql`SELECT email, created_at FROM waitlist_emails ORDER BY created_at DESC`
      return res.status(200).json({ emails: rows })
    } catch (err) {
      console.error('Waitlist fetch error:', err)
      return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
