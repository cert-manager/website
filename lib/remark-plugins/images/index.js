// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license.

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
