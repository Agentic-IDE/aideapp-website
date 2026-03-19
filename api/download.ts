import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isValidPlatform, getLatestRelease, getDownloadUrl, hashIp } from './_lib/github'
import { incrementDownload } from './_lib/downloads'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { platform } = req.query

  if (!isValidPlatform(platform)) {
    return res.status(400).json({ message: 'Invalid platform. Must be: mac, windows, or linux' })
  }

  try {
    const release = await getLatestRelease()
    const url = getDownloadUrl(platform, release.tag, release.assets)

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
    console.log(JSON.stringify({
      event: 'download',
      platform,
      version: release.tag,
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'unknown',
      ipHash: hashIp(ip),
    }))

    // Track download count — don't block the redirect on failure
    incrementDownload(platform).catch(() => {})

    return res.redirect(307, url)
  } catch {
    return res.status(502).json({ message: 'Unable to fetch download link' })
  }
}
