import { NextResponse } from 'next/server'
import { put }          from '@vercel/blob'
import path             from 'path'
import { v4 as uuid }  from 'uuid'

function verifyAdmin(req) {
  return req.headers.get('x-admin-token') === (process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123')
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files    = formData.getAll('images')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    const savedPaths  = []

    for (const file of files) {
      if (!file || typeof file === 'string') continue

      const ext = path.extname(file.name || '').toLowerCase() || '.jpg'
      if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: `File type ${ext} not allowed` }, { status: 400 })
      }

      const filename = `uploads/${uuid()}${ext}`
      const blob     = await put(filename, file, { access: 'public' })
      savedPaths.push(blob.url)
    }

    return NextResponse.json({ paths: savedPaths })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed: ' + err.message }, { status: 500 })
  }
}
