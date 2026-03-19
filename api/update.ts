import type { VercelRequest, VercelResponse } from '@vercel/node'
import {
  isValidPlatform,
  isRateLimited,
  getLatestRelease,
  isNewerVersion,
  getDownloadUrl,
  signUrl,
} from './_lib/github'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { version, platform } = req.query

  if (!isValidPlatform(platform)) {
    return res.status(400).json({ message: 'Invalid platform. Must be: mac, windows, or linux' })
  }

  if (!version || typeof version !== 'string') {
    return res.status(400).json({ message: 'Missing version parameter' })
  }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return res.status(429).json({ message: 'Too many requests. Try again later.' })
  }

  try {
    const release = await getLatestRelease()

    if (!isNewerVersion(version, release.tag)) {
      return res.status(204).end()
    }

    const url = getDownloadUrl(platform, release.tag, release.assets)
    const { signature, expires } = signUrl(url)

    return res.status(200).json({
      version: release.tag,
      notes: release.notes,
      url,
      signature,
      expires,
    })
  } catch {
    return res.status(502).json({ message: 'Unable to check for updates' })
  }
}
