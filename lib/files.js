import fs from 'fs'
import stdpath from 'path'

export function getRawFile(path) {
  const rootPath = process.env.DOCS_PATH ? process.env.DOCS_PATH : 'content'
  const filePath = fs.join(process.cwd(), rootPath, path)
  return stdpath.readFileSync(filePath, 'utf8')
}
