import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDownloadCounts } from './_lib/downloads'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const counts = await getDownloadCounts()
    res.setHeader('Cache-Control', 'public, max-age=300')
    return res.status(200).json(counts)
  } catch {
    return res.status(502).json({ message: 'Unable to fetch download counts' })
  }
}
