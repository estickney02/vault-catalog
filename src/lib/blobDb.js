import { put, list, del } from '@vercel/blob'
import fs from 'fs'
import path from 'path'

const TOKEN = process.env.EMONEY_BLOB_READ_WRITE_TOKEN
const IS_PROD = !!TOKEN

export async function readJson(key, defaultValue) {
  if (IS_PROD) {
    try {
      const { blobs } = await list({ prefix: `db/${key}.json`, token: TOKEN })
      if (!blobs.length) return defaultValue
      // Sort newest first — list() returns oldest first
      blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      const res = await fetch(blobs[0].url + '?t=' + Date.now())
      if (!res.ok) return defaultValue
      return await res.json()
    } catch {
      return defaultValue
    }
  } else {
    try {
      const filePath = path.join(process.cwd(), 'data', `${key}.json`)
      return JSON.parse(fs.readFileSync(filePath, 'utf8'))
    } catch {
      return defaultValue
    }
  }
}

export async function writeJson(key, data) {
  if (IS_PROD) {
    // Delete all old versions first, then write fresh
    try {
      const { blobs } = await list({ prefix: `db/${key}.json`, token: TOKEN })
      if (blobs.length > 0) {
        await del(blobs.map(b => b.url), { token: TOKEN })
      }
    } catch {}
    await put(`db/${key}.json`, JSON.stringify(data), {
      access: 'public',
      token: TOKEN,
      allowOverwrite: true,
    })
  } else {
    const filePath = path.join(process.cwd(), 'data', `${key}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  }
}
