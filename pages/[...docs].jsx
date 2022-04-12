import { withRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { pageProps, staticPaths } from '@zentered/next-product-docs/serialize'
import { Documentation } from '@zentered/next-product-docs'

import Sidebar from 'components/docs/Sidebar'
import Toc from 'components/docs/Toc'
import getCurrentUrl from 'lib/currentUrl'
import { meta as page } from 'content/pages/docs.mdx'
import theme from 'lib/github.js'

import { readdir } from 'fs/promises'
import { join } from 'path'

const DocumentationPage = ({
  router,
  title,
  sidebarRoutes,
  versions,
  source,
  tocHeadings
}) => {
  const currentUrl = getCurrentUrl(router)
  if (!source) return null
  return (
    <>
      <NextSeo
        title={`${title} ${page.pageTitle}`}
        description={page.description}
        canonical={currentUrl}
        openGraph={{
          url: currentUrl,
          title: page.title,
          description: page.description
        }}
      />
      <div className="container mt-20 pb-24">
        <div className="w-full md:grid grid-cols-12 gap-12 xl:gap-16">
          <div className="col-span-4 lg:col-span-3 xl:col-span-2 md:border-r border-gray-2/50 pr-5">
            <Sidebar
              router={router}
              routes={sidebarRoutes}
              versions={versions}
            />
          </div>
          <main className="col-span-8 lg:col-span-9 xl:col-span-8 docs">
            <div className="mx-auto md:mx-0 prose max-w-full main-docs-section">
              <Documentation source={source} theme={theme} />
            </div>
          </main>
          <div className="hidden xl:block col-span-2 border-l border-gray-2/50 pl-5">
            <Toc contents={tocHeadings} />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(DocumentationPage)

export async function getStaticPaths() {
  const dirs = await readdir(join(process.cwd(), 'content'))
  const docs = dirs.filter((d) => d.endsWith('docs'))
  let paths = []

  for (const doc of docs) {
    const docPaths = await staticPaths({ docsFolder: doc })
    paths = paths.concat(docPaths)
  }

  return { paths, fallback: false }
}

export async function getStaticProps(ctx) {
  ctx.params.docsFolder = ctx.params.docs[0]
  ctx.params.slug = ctx.params.docs

  const props = await pageProps(ctx)

  // fetch content/*-docs folders as versions
  const dirs = await readdir(join(process.cwd(), 'content'))
  const docs = dirs.filter((d) => d.endsWith('docs'))
  props.versions = docs

  return { props }
}
