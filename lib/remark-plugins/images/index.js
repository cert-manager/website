import { visit } from 'unist-util-visit'
import { URL } from 'url'

export default function relativeLinks(options) {
  if (!options) {
    options = {}
  }
  if (!options.destination) return

  function visitor(node) {
    if (node && node.url) {
      if (node.url.includes('assets/')) {
        const removePath = node.url.replace('assets/', '')
        const rewriteUrl = new URL(removePath, options.destination)
        node.url = rewriteUrl.href
      }
    }
  }

  function transform(tree) {
    visit(tree, ['image'], visitor)
  }

  return transform
}
