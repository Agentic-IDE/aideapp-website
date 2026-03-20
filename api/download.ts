import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash } from 'crypto'

const RELEASE_TAG = 'free-v0.3.2'
const RELEASE_BASE = `https://github.com/Agentic-IDE/AgenticIDE-AIDE-/releases/download/${RELEASE_TAG}`

const VALID_PLATFORMS = ['mac', 'windows', 'linux'] as const
type Platform = (typeof VALID_PLATFORMS)[number]

const PLATFORM_ASSETS: Record<Platform, string> = {
  mac: 'Agentic.IDE_0.1.6_universal.dmg',
  windows: 'Agentic.IDE_0.1.6_x64-setup.exe',
  linux: 'Agentic.IDE_0.1.6_amd64.AppImage',
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

  return res.redirect(307, url)
}
