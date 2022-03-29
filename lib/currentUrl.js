const liveUrl = process.env.NEXT_PUBLIC_DOMAIN_URL
const previewUrl = process.env.NEXT_PUBLIC_VERCEL_URL

const deployUrl =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? liveUrl : previewUrl

export default function getCurrentUrl(router) {
  if (!deployUrl) {
    return router.asPath
  }

  return `https://${deployUrl}${router.asPath}`
}

export function getDeployUrl() {
  if (!deployUrl) {
    return ''
  }

  return `https://${deployUrl}`
}
