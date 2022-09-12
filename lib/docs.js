import { getRawFile } from './files'

const DOCS_FALLBACK = process.env.DOCS_FALLBACK
  ? process.env.DOCS_FALLBACK
  : 'README'
const DOCS_EXTENSION = process.env.DOCS_USE_MDX === 'true' ? '.mdx' : '.md'

function getDocsSlug(slug) {
  return slug?.length ? slug : [DOCS_FALLBACK]
}

function removeFromLast(path, key) {
  const i = path.lastIndexOf(key)
  return i === -1 ? path : path.substring(0, i)
}

export function getSlug(params) {
  const slug = getDocsSlug(params.docs)
  return { slug: `/${slug.join('/')}` }
}

export async function fetchDocsManifest(docsFolder) {
  const path = `/${docsFolder}/manifest.json`
  const res = await getRawFile(path)
  return JSON.parse(res)
}

export function findRouteByPath(path, routes) {
  for (const route of routes) {
    if (route.path && removeFromLast(route.path, DOCS_EXTENSION) === path) {
      return route
    } else if (
      route.path &&
      removeFromLast(route.path, DOCS_EXTENSION).replace(
        `/${DOCS_FALLBACK}`,
        ''
      ) === path
    ) {
      return route
    }
    const childPath = route.routes && findRouteByPath(path, route.routes)
    if (childPath) return childPath
  }
}

export function getPaths(nextRoutes, carry = []) {
  nextRoutes.forEach(({ path, routes }) => {
    if (path) {
      if (path.indexOf(DOCS_FALLBACK) > -1) {
        carry.push(
          removeFromLast(path, DOCS_EXTENSION).replace(`/${DOCS_FALLBACK}`, '')
        )
      }
      carry.push(removeFromLast(path, DOCS_EXTENSION))
    } else if (routes) {
      getPaths(routes, carry)
    }
  })

  return carry
}

export function replaceDefaultPath(routes) {
  for (const route of routes) {
    if (route.path) {
      route.path = route.path.split(DOCS_EXTENSION)[0]
      if (route.path.indexOf(DOCS_FALLBACK) > -1) {
        route.path = route.path.replace(DOCS_FALLBACK, '')
        // remove trailing slash
        if (route.path.endsWith('/')) {
          route.path = route.path.slice(0, -1)
        }
      }
    }
    if (route.routes) {
      replaceDefaultPath(route.routes)
    }
  }
}
