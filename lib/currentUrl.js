const liveUrl = process.env.NEXT_PUBLIC_DOMAIN_URL

export default function getCurrentUrl(router) {
  if (process.env.NODE_ENV !== 'production') {
    return router.asPath
  }
  return `${liveUrl}${router.asPath}`
}
