import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash } from 'crypto'

const AZURE_CDN_BASE_URL = process.env.AZURE_CDN_BASE_URL || ''
const FALLBACK_VERSION = '0.3.2'

const VALID_PLATFORMS = ['mac', 'windows', 'linux'] as const
type Platform = (typeof VALID_PLATFORMS)[number]

const PLATFORM_EXT: Record<Platform, string> = {
  mac: '.dmg',
  windows: '.exe',
  linux: '.AppImage',
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
  const version = FALLBACK_VERSION
  const filename = `AIDE-${version}-${p}${PLATFORM_EXT[p]}`
  const url = AZURE_CDN_BASE_URL ? `${AZURE_CDN_BASE_URL}/${filename}` : `https://github.com/Agentic-IDE/AgenticIDE-AIDE-/releases/download/free-v${version}/${filename}`

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  console.log(JSON.stringify({
    event: 'download',
    platform: p,
    version,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'unknown',
    ipHash: createHash('sha256').update(ip).digest('hex'),
  }))

  return res.redirect(307, url)
}
