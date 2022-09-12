// Forked 26/01/2022 from https://github.com/kevin940726/remark-code-import
// MIT License

import fs from 'fs'
import path from 'path'
import { EOL } from 'os'
import { visit } from 'unist-util-visit'
import stripIndent from 'strip-indent'
function extractLines(
  content,
  fromLine,
  hasDash,
  toLine,
  preserveTrailingNewline = false
) {
  const lines = content.split(EOL)
  const start = fromLine || 1
  let end
  if (!hasDash) {
    end = start
  } else if (toLine) {
    end = toLine
  } else if (lines[lines.length - 1] === '' && !preserveTrailingNewline) {
    end = lines.length - 1
  } else {
    end = lines.length
  }
  return lines.slice(start - 1, end).join('\n')
}
function codeImport(options = {}) {
  let basePath = ''
  if (options.disabled) {
    return
  }

  const rootDir = options.rootDir || process.cwd()
  if (!path.isAbsolute(rootDir)) {
    throw new Error(`"rootDir" has to be an absolute path`)
  }

  return function transformer(tree, file) {
    const codes = []
    const promises = []

    visit(tree, 'code', (node, index, parent) => {
      codes.push([node, index, parent])
    })
    for (const [node] of codes) {
      const fileMeta = (node.meta || '')
        // Allow escaping spaces
        .split(/(?<!\\) /g)
        .find((meta) => meta.startsWith('file='))

      if (!fileMeta) {
        continue
      }
      if (options.importBasePath) {
        basePath = options.importBasePath
      } else {
        basePath = file.dirname
      }
      const res =
        /^file=(?<path>.+?)(?:(?:#(?:L(?<from>\d+)(?<dash>-)?)?)(?:L(?<to>\d+))?)?$/.exec(
          fileMeta
        )
      if (!res || !res.groups || !res.groups.path) {
        throw new Error(`Unable to parse file path ${fileMeta}`)
      }
      const filePath = res.groups.path
      const fromLine = res.groups.from
        ? parseInt(res.groups.from, 10)
        : undefined
      const hasDash = !!res.groups.dash || fromLine === undefined
      const toLine = res.groups.to ? parseInt(res.groups.to, 10) : undefined
      const normalizedFilePath = filePath
        .replace(/^<rootDir>/, rootDir)
        .replace(/\\ /g, ' ')
      const fileAbsPath = path.resolve(basePath, normalizedFilePath)

      if (!options.allowImportingFromOutside) {
        const relativePathFromRootDir = path.relative(rootDir, fileAbsPath)
        if (
          !rootDir ||
          relativePathFromRootDir.startsWith(`..${path.sep}`) ||
          path.isAbsolute(relativePathFromRootDir)
        ) {
          throw new Error(
            `Attempted to import code from "${fileAbsPath}", which is outside from the rootDir "${rootDir}"`
          )
        }
      }
      if (options.async) {
        promises.push(
          new Promise((resolve, reject) => {
            fs.readFile(fileAbsPath, 'utf8', (err, fileContent) => {
              if (err) {
                reject(err)
                return
              }
              node.value = extractLines(
                fileContent,
                fromLine,
                hasDash,
                toLine,
                options.preserveTrailingNewline
              )
              if (options.removeRedundantIndentations) {
                node.value = stripIndent(node.value)
              }
              resolve()
            })
          })
        )
      } else {
        const fileContent = fs.readFileSync(fileAbsPath, 'utf8')
        node.value = extractLines(
          fileContent,
          fromLine,
          hasDash,
          toLine,
          options.preserveTrailingNewline
        )
        if (options.removeRedundantIndentations) {
          node.value = stripIndent(node.value)
        }
      }
    }
    if (promises.length) {
      return Promise.all(promises)
    }
  }
}
export { codeImport }
