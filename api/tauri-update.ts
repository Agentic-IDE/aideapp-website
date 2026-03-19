import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getLatestFreeRelease } from './_lib/github'

/**
 * Tauri auto-updater endpoint. Returns the platform-specific update manifest
 * for the latest free-v* release.
 *
 * Tauri updater expects:
 * {
 *   "version": "0.1.8",
 *   "notes": "...",
 *   "pub_date": "2026-03-19T00:00:00Z",
 *   "platforms": {
 *     "darwin-universal": { "url": "https://...", "signature": "..." },
 *     "linux-x86_64":    { "url": "https://...", "signature": "..." },
 *     "windows-x86_64":  { "url": "https://...", "signature": "..." }
 *   }
 * }
 */
export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const release = await getLatestFreeRelease()

    // Build platform map from release assets
    // Tauri releases include .tar.gz (update bundle) and .tar.gz.sig (signature)
    const platforms: Record<string, { url: string; signature: string }> = {}

    const platformMap: Record<string, string> = {
      // macOS universal
      '.app.tar.gz': 'darwin-universal',
      // Linux
      '.AppImage.tar.gz': 'linux-x86_64',
      // Windows
      '.msi.zip': 'windows-x86_64',
    }

    for (const [ext, platform] of Object.entries(platformMap)) {
      const bundle = release.assets.find((a) => a.name.endsWith(ext) && !a.name.endsWith('.sig'))
      const sig = release.assets.find((a) => a.name.endsWith(ext + '.sig'))

      if (bundle && sig) {
        // Fetch the signature content (it's a small text file)
        let signature = ''
        try {
          const sigRes = await fetch(sig.url)
          if (sigRes.ok) signature = await sigRes.text()
        } catch {
          // Skip platform if signature can't be fetched
          continue
        }

        platforms[platform] = {
          url: bundle.url,
          signature: signature.trim(),
        }
      }
    }

    if (Object.keys(platforms).length === 0) {
      return res.status(204).end()
    }

    res.setHeader('Cache-Control', 'public, max-age=300')
    return res.status(200).json({
      version: release.tag,
      notes: release.notes,
      pub_date: new Date().toISOString(),
      platforms,
    })
  } catch {
    return res.status(204).end()
  }
}
