import type { VercelRequest, VercelResponse } from '@vercel/node'
import { list } from '@vercel/blob'

const BLOB_PATH = 'downloads/count.json'

interface DownloadCounts {
  total: number
  byPlatform: { mac: number; windows: number; linux: number }
}

async function getDownloadCounts(): Promise<DownloadCounts> {
  const { blobs } = await list({ prefix: BLOB_PATH })
  if (blobs.length === 0) return { total: 0, byPlatform: { mac: 0, windows: 0, linux: 0 } }
  const res = await fetch(blobs[0].url)
  return res.json()
}

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
