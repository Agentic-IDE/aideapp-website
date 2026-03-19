import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'public, max-age=3600')
  return res.status(200).json({
    connectionString: process.env.AZURE_INSIGHTS_CONNECTION_STRING || '',
  })
}
