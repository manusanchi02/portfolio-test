import { closeSync, openSync, readdirSync, readSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const HEADER_BYTES = 32

export function readWebpSize(filePath) {
  const header = Buffer.alloc(HEADER_BYTES)
  const fd = openSync(filePath, 'r')
  let bytesRead
  try {
    bytesRead = readSync(fd, header, 0, HEADER_BYTES, 0)
  } finally {
    closeSync(fd)
  }
  if (bytesRead < HEADER_BYTES) return null
  if (header.toString('ascii', 0, 4) !== 'RIFF' || header.toString('ascii', 8, 12) !== 'WEBP') return null

  const chunk = header.toString('ascii', 12, 16)
  if (chunk === 'VP8 ') {
    return { width: header.readUInt16LE(26) & 0x3fff, height: header.readUInt16LE(28) & 0x3fff }
  }
  if (chunk === 'VP8L') {
    const bits = header.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 }
  }
  if (chunk === 'VP8X') {
    return { width: header.readUIntLE(24, 3) + 1, height: header.readUIntLE(27, 3) + 1 }
  }
  return null
}

/** Maps site-relative paths (`uploads/a.webp`) to their pixel size. Unreadable files map to null. */
export function collectImageDimensions(publicDir) {
  const dimensions = {}
  const walk = (directory) => {
    for (const name of readdirSync(directory)) {
      const fullPath = join(directory, name)
      if (statSync(fullPath).isDirectory()) {
        walk(fullPath)
      } else if (name.toLowerCase().endsWith('.webp')) {
        const key = relative(publicDir, fullPath).split('\\').join('/')
        dimensions[key] = readWebpSize(fullPath)
      }
    }
  }
  try {
    walk(join(publicDir, 'uploads'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  return dimensions
}
