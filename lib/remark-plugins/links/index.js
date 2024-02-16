// This file originates from https://github.com/zentered/next-product-docs on
// the branch "main" (commit fdcc8b5), copyright
// Zentered 2022, licensed under the Apache 2.0 license.

import { visit } from 'unist-util-visit'
import { resolve, sep } from 'node:path'

export default function relativeLinks(options) {
  let extensions = ['.mdx', '.md']
  const moduleRootPath = options.rootPath
  const prefix = options.prefix
  if (options.extensions) {
    extensions = options.extensions
  }

  /**
   * This function takes an internal url and converts it into a web url.
   * It handles relative and absolute paths.
   *
   * @param {*} node
   * @returns node
   */
  function visitor(node) {
    if (
      node &&
      node.url &&
      !node.url.startsWith('http') &&
      !node.url.startsWith('mailto:')
    ) {
      // keep a copy of the original node url for comparison
      const originalUrl = node.url
      let rootPath = moduleRootPath

      if (options.debug) {
        console.log(rootPath, node.url, options)
      }

      // remove the filename from the rootPath if it's an anchor link
      if (!node.url.startsWith('#')) {
        rootPath = rootPath.split('/').slice(0, -1).join('/')
      }

      // drop all extensions from root and node url
      for (const ext of extensions) {
        rootPath = rootPath.replace(ext, '')
        node.url = node.url.replace(ext, '')
      }

      // add prefix to rootPath if it has been passed
      if (prefix && !rootPath.startsWith(`/${prefix}`)) {
        rootPath = `/${prefix}${rootPath}`
      }

      // drop README from root and node url
      rootPath = rootPath.replace('/README', '')
      node.url = node.url.replace('/README', '')

      // check if the depth of the node.url goes beyond the rootPath
      const rootPathParts = rootPath.split(sep).slice(1)
      const depth = (originalUrl.match(/\.\.\//g) || []).length
      const skipPrefix = depth > 0 && rootPathParts.length === depth
      const relative = resolve(rootPath, node.url)
      if (
        !skipPrefix &&
        !relative.startsWith(`/${prefix}`) &&
        !originalUrl.startsWith('/')
      ) {
        node.url = `/${prefix}${relative}`
      } else {
        node.url = relative
      }

      if (options.debug) {
        console.log(`rootPath: ${rootPath}`)
        console.log(`nodeUrl: ${originalUrl}`)
        console.log(`calculated URL: ${relative}`)
      }

      // add trailing slash and handle anchor link if needed
      if (options.trailingSlash && originalUrl.includes('#')) {
        if (!node.url.includes('/#')) {
          node.url = node.url.replace('#', '/#')
        }
      } else if (options.trailingSlash === true && !node.url.endsWith('/')) {
        node.url += '/'
      }
    }
  }

  function transform(tree) {
    visit(tree, ['link'], visitor)
  }

  return transform
}