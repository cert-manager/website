import { withRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { pageProps, staticPaths } from '@zentered/next-product-docs/serialize'
import Documentation from '@zentered/next-product-docs'

import Sidebar from 'components/docs/Sidebar'
import Toc from 'components/docs/Toc'
import getCurrentUrl from 'lib/currentUrl'
import { meta as page } from '../../content/pages/docs.mdx'
import theme from '../../lib/github.js'

const DocumentationPage = ({
  router,
  title,
  sidebarRoutes,
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
            <Sidebar routes={sidebarRoutes} />
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
  const paths = await staticPaths()
  return { paths, fallback: false }
}

export async function getStaticProps(ctx) {
  const props = await pageProps(ctx)
  return { props }
}
