import { put, list, getDownloadUrl } from '@vercel/blob'

const LATEST_PATH = 'releases/latest.json'
const LATEST_FREE_PATH = 'releases/latest-free.json'

export interface CachedRelease {
  tag: string
  notes: string
  assets: Array<{ name: string; url: string }>
  published_at: string
}

async function readBlob(path: string): Promise<CachedRelease | null> {
  try {
    const { blobs } = await list({ prefix: path })
    if (blobs.length === 0) return null
    const url = await getDownloadUrl(blobs[0].url)
    const res = await fetch(url)
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function writeBlob(path: string, data: CachedRelease): Promise<void> {
  await put(path, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export async function getCachedRelease(): Promise<CachedRelease | null> {
  return readBlob(LATEST_PATH)
}

export async function getCachedFreeRelease(): Promise<CachedRelease | null> {
  return readBlob(LATEST_FREE_PATH)
}

export async function cacheRelease(data: CachedRelease): Promise<void> {
  return writeBlob(LATEST_PATH, data)
}

export async function cacheFreeRelease(data: CachedRelease): Promise<void> {
  return writeBlob(LATEST_FREE_PATH, data)
}
