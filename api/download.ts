import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash } from 'crypto'
import { put, list } from '@vercel/blob'

const RELEASE_TAG = 'free-v0.4.4'
const RELEASE_BASE = process.env.DOWNLOAD_BASE_URL || ''
const BLOB_PATH = 'downloads/count.json'

const VALID_PLATFORMS = ['mac', 'windows', 'linux'] as const
type Platform = (typeof VALID_PLATFORMS)[number]

const PLATFORM_ASSETS: Record<Platform, string> = {
  mac: 'Agentic.IDE_0.4.4_universal.dmg',
  windows: 'Agentic.IDE_0.4.4_x64-setup.exe',
  linux: 'Agentic.IDE_0.4.4_amd64.AppImage',
}

interface DownloadCounts {
  total: number
  byPlatform: { mac: number; windows: number; linux: number }
}

async function incrementDownload(platform: Platform): Promise<void> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH })
    let counts: DownloadCounts = { total: 0, byPlatform: { mac: 0, windows: 0, linux: 0 } }
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url)
      counts = await res.json()
    }
    counts.total += 1
    counts.byPlatform[platform] += 1
    await put(BLOB_PATH, JSON.stringify(counts), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    })
  } catch {
    // Don't block the download if counting fails
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { platform } = req.query
  if (typeof platform !== 'string' || !VALID_PLATFORMS.includes(platform as Platform)) {
    return res.status(400).json({ message: 'Invalid platform. Must be: mac, windows, or linux' })
  }

  const p = platform as Platform
  const url = `${RELEASE_BASE}/${PLATFORM_ASSETS[p]}`

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  console.log(JSON.stringify({
    event: 'download',
    platform: p,
    version: RELEASE_TAG,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'unknown',
    ipHash: createHash('sha256').update(ip).digest('hex'),
  }))

  // Increment count without blocking the redirect
  incrementDownload(p)

  return res.redirect(307, url)
}
