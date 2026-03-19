import { createHmac, createHash } from 'crypto'
import { getCachedRelease, getCachedFreeRelease } from './releases'

// --- Environment ---

const AZURE_CDN_BASE_URL = process.env.AZURE_CDN_BASE_URL || ''
const UPDATE_SECRET = process.env.UPDATE_SECRET || ''

// --- Constants ---

export const VALID_PLATFORMS = ['mac', 'windows', 'linux'] as const
export type Platform = (typeof VALID_PLATFORMS)[number]

const PLATFORM_EXT: Record<Platform, string> = {
  mac: '.dmg',
  windows: '.exe',
  linux: '.AppImage',
}

// --- Release cache (Vercel Blob-backed, populated by webhook) ---

interface ReleaseInfo {
  tag: string
  notes: string
  assets: Array<{ name: string; url: string }>
}

export async function getLatestRelease(): Promise<ReleaseInfo> {
  const cached = await getCachedRelease()
  if (!cached) throw new Error('No cached release — webhook has not fired yet')
  return cached
}

export async function getLatestFreeRelease(): Promise<ReleaseInfo> {
  const cached = await getCachedFreeRelease()
  if (!cached) throw new Error('No cached free release — webhook has not fired yet')
  return cached
}

// --- Download URL construction ---

export function getDownloadUrl(platform: Platform, version: string, assets: ReleaseInfo['assets']): string {
  const ext = PLATFORM_EXT[platform]
  const filename = `AIDE-${version}-${platform}${ext}`

  if (AZURE_CDN_BASE_URL) {
    return `${AZURE_CDN_BASE_URL}/${filename}`
  }

  // Fallback: find matching asset in release and use its download URL
  const asset = assets.find((a) => a.name === filename)
  if (asset) {
    return asset.url
  }

  // Last resort: construct the expected URL pattern
  return `https://github.com/Agentic-IDE/AgenticIDE-AIDE-/releases/download/v${version}/${filename}`
}

// --- Version comparison ---

export function isNewerVersion(current: string, latest: string): boolean {
  const parse = (v: string) => v.replace(/^v/, '').split('.').map(Number)
  const c = parse(current)
  const l = parse(latest)
  const len = Math.max(c.length, l.length)

  for (let i = 0; i < len; i++) {
    const cv = c[i] || 0
    const lv = l[i] || 0
    if (lv > cv) return true
    if (lv < cv) return false
  }
  return false
}

// --- Signing ---

export function signUrl(url: string): { signature: string; expires: number } {
  const expires = Math.floor(Date.now() / 1000) + 3600 // 1 hour
  const payload = `${url}|${expires}`
  const signature = createHmac('sha256', UPDATE_SECRET).update(payload).digest('hex')
  return { signature, expires }
}

// --- IP hashing ---

export function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex')
}

// --- Rate limiting ---

const rateLimitMap = new Map<string, number>()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const lastHit = rateLimitMap.get(ip)

  if (lastHit && now - lastHit < RATE_LIMIT_WINDOW_MS) {
    return true
  }

  rateLimitMap.set(ip, now)
  return false
}

// --- Validation ---

export function isValidPlatform(value: unknown): value is Platform {
  return typeof value === 'string' && VALID_PLATFORMS.includes(value as Platform)
}
