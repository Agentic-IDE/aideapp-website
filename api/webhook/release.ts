import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHmac } from 'crypto'
import { cacheRelease, cacheFreeRelease, type CachedRelease } from '../_lib/releases'

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || ''

function verifySignature(body: string, signature: string | undefined): boolean {
  if (!WEBHOOK_SECRET || !signature) return false
  const expected = 'sha256=' + createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
  return signature === expected
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Validate webhook signature
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
  const sig = req.headers['x-hub-signature-256'] as string | undefined
  if (!verifySignature(body, sig)) {
    return res.status(401).json({ message: 'Invalid signature' })
  }

  // Only handle release.published events
  const event = req.headers['x-github-event']
  if (event !== 'release') {
    return res.status(200).json({ message: 'Ignored event', event })
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  if (payload.action !== 'published') {
    return res.status(200).json({ message: 'Ignored action', action: payload.action })
  }

  // Extract release data
  const release = payload.release
  const tag = release.tag_name as string
  const isFree = tag.startsWith('free-v')

  // Rewrite asset URLs to Azure CDN if configured (private repo assets aren't publicly accessible)
  const cdnBase = process.env.AZURE_CDN_BASE_URL || ''

  const data: CachedRelease = {
    tag: tag.replace(/^(free-)?v/, ''),
    notes: release.body || '',
    assets: (release.assets || []).map((a: { name: string; browser_download_url: string }) => ({
      name: a.name,
      url: cdnBase ? `${cdnBase}/${a.name}` : a.browser_download_url,
    })),
    published_at: release.published_at || new Date().toISOString(),
  }

  // Cache to Vercel Blob
  try {
    if (isFree) {
      await cacheFreeRelease(data)
    } else {
      await cacheRelease(data)
    }
  } catch (err) {
    console.error('Failed to cache release:', err)
    return res.status(500).json({ message: 'Cache write failed' })
  }

  console.log(JSON.stringify({
    event: 'release_cached',
    tag,
    isFree,
    assetCount: data.assets.length,
    timestamp: new Date().toISOString(),
  }))

  return res.status(200).json({ ok: true, tag, cached: isFree ? 'latest-free' : 'latest' })
}
