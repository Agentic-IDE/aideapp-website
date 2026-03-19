import { put, list, getDownloadUrl } from '@vercel/blob'

const BLOB_PATH = 'downloads/count.json'

interface DownloadCounts {
  total: number
  byPlatform: { mac: number; windows: number; linux: number }
}

const DEFAULT_COUNTS: DownloadCounts = {
  total: 0,
  byPlatform: { mac: 0, windows: 0, linux: 0 },
}

async function getCounts(): Promise<DownloadCounts> {
  const { blobs } = await list({ prefix: BLOB_PATH })
  if (blobs.length === 0) return { ...DEFAULT_COUNTS }
  const downloadUrl = await getDownloadUrl(blobs[0].url)
  const res = await fetch(downloadUrl)
  return res.json()
}

async function saveCounts(counts: DownloadCounts): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(counts), {
    access: 'private',
    addRandomSuffix: false,
    contentType: 'application/json',
  })
}

export async function incrementDownload(platform: 'mac' | 'windows' | 'linux'): Promise<void> {
  const counts = await getCounts()
  counts.total += 1
  counts.byPlatform[platform] += 1
  await saveCounts(counts)
}

export async function getDownloadCounts(): Promise<DownloadCounts> {
  return getCounts()
}
