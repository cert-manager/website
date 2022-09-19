// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license, which in turn had
// copied it from https://github.com/imcuttle/remark-heading-id, copyright
// imcuttle 2019, licensed under the MIT license.

import { visit } from 'unist-util-visit'

export default function headingIds() {
  return function (node) {
    visit(node, 'heading', (node) => {
      const lastChild = node.children[node.children.length - 1]
      if (lastChild && lastChild.type === 'text') {
        let string = lastChild.value.replace(/ +$/, '')
        const matched = string.match(/ {#([^]+?)}$/)

        if (matched) {
          const id = matched[1]
          if (!!id.length) {
            if (!node.data) {
              node.data = {}
            }
            if (!node.data.hProperties) {
              node.data.hProperties = {}
            }
            node.data.id = node.data.hProperties.id = id

            string = string.substring(0, matched.index)
            lastChild.value = string
          }
        }
      }
    })
  }
}
