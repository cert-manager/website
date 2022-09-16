// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license. A copy of the
// Apache 2.0 license is available in the file LICENSE.

const liveUrl = process.env.NEXT_PUBLIC_DOMAIN_URL

export default function getCurrentUrl(router) {
  if (process.env.NODE_ENV !== 'production') {
    return router.asPath
  }
  return `${liveUrl}${router.asPath}`
}
