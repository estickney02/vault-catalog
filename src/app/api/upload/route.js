import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

function verifyAdmin(request) {
  const token = request.headers.get('x-admin-token')
  const validToken = process.env.ADMIN_SESSION_TOKEN || 'vault_session_abc123'
  return token === validToken
}

export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const files = formData.getAll('images')

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const savedPaths = []

    for (const file of files) {
      if (!file || typeof file === 'string') continue

      const buffer = Buffer.from(await file.arrayBuffer())
      const originalName = file.name || 'upload'
      const ext = path.extname(originalName).toLowerCase() || '.jpg'
      const allowedExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

      if (!allowedExts.includes(ext)) {
        return NextResponse.json({ error: `File type ${ext} not allowed` }, { status: 400 })
      }

      const filename = `${uuidv4()}${ext}`
      const filepath = path.join(uploadDir, filename)
      fs.writeFileSync(filepath, buffer)
      savedPaths.push(`/uploads/${filename}`)
    }

    return NextResponse.json({ paths: savedPaths })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
