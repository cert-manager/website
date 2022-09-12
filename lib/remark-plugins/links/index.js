import { visit } from 'unist-util-visit'

export default function relativeLinks(options) {
  if (!options || !options.prefix) {
    throw Error('Missing required "prefix" option')
  }

  let pathParts = []
  let extensions = ['.mdx', '.md']
  const slug = options.slug

  if (options.extensions) {
    extensions = options.extensions
  }

  function visitor(node) {
    let nodePrefix = options.prefix
    if (node && node.url && !node.url.startsWith('http')) {
      if (process.env.DEBUG === 'true') {
        // helps to identify "special cases" and add those to the tests
        console.log(node.url, options)
      }

      // ignore mailto: links
      if (node.url.startsWith('mailto:')) {
        return
      }

      // handle relative paths
      if (node.url.startsWith('#')) {
        if (slug[0] === nodePrefix) {
          pathParts = slug.slice(1)
        } else {
          pathParts = slug
        }
      } else if (slug && Array.isArray(slug)) {
        if (slug[0] === nodePrefix) {
          slug.shift()
        }
        const depth = (node.url.match(/\.\.\//g) || []).length
        if (slug.length <= 1) {
          pathParts = slug
        } else if (depth >= slug.length) {
          nodePrefix = ''
          pathParts = []
        } else {
          const removeLast = slug.length - depth - 1
          pathParts = slug.slice(0, removeLast)
        }
      }

      if (node.url.startsWith('/')) {
        node.url = node.url.replace('/', '')
      }

      if (node.url.startsWith('./')) {
        node.url = node.url.replace('./', '')
      }

      if (node.url.startsWith('../')) {
        node.url = node.url.replace(/\.\.\//g, '')
      }

      let path = ''
      if (pathParts) {
        if (pathParts.length >= 1) {
          if (pathParts[0] !== nodePrefix) {
            path = nodePrefix + '/' + pathParts.join('/')
          }
          path += '/'
        } else {
          if (nodePrefix) {
            path = nodePrefix + '/'
          }
        }
      }

      node.url = `/${path}${node.url}`

      if (options.trailingSlash && node.url.includes('#')) {
        node.url = node.url.replace('#', '/#')
      } else if (options.trailingSlash === true && !node.url.endsWith('/')) {
        node.url += '/'
      }

      for (const ext of extensions) {
        if (node.url.includes(ext)) {
          node.url = node.url.replace(ext, '')
        }
      }

      if (node.url.includes('README')) {
        node.url = node.url.replace('README', '')
      }
    }
  }

  function transform(tree) {
    visit(tree, ['link'], visitor)
  }

  return transform
}
