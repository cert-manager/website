// You probably wonder why this file, [...docs].jsx, contains square brackets and
// dots. The reason is that the only way to do "dynamic routes" in Next.js is to
// use a file name containing square brackets and dots. You can learn more at:
// https://nextjs.org/docs/routing/dynamic-routes.

import { readdir } from 'fs/promises'
import { join } from 'path'

import { MDXRemote } from 'next-mdx-remote'
import { NextSeo } from 'next-seo'
import { withRouter } from 'next/router'
import { Element } from 'react-scroll'
import { themes } from 'prism-react-renderer'

import CodeBlock from 'components/docs/CodeBlock.jsx'
import InlineCode from 'components/docs/InlineCode.jsx'
import Sidebar from 'components/docs/Sidebar'
import Toc from 'components/docs/Toc'

import getCurrentUrl from 'lib/currentUrl'
import { pageProps, staticPaths } from 'lib/serialize'

import { meta as page } from 'content/pages/docs.mdx'

const DocumentationPage = ({
  router,
  title,
  sidebarRoutes,
  versions,
  source,
  tocHeadings,
  frontmatter
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
          title: frontmatter.title,
          description: frontmatter.description
        }}
      />
      <div className="container mt-6 pb-48">
        <div className="w-full md:grid grid-cols-12 gap-12 xl:gap-16">
          <div className="col-span-4 lg:col-span-3 xl:col-span-3 md:border-r border-gray-2/50 pr-5">
            <Sidebar
              router={router}
              routes={sidebarRoutes}
              versions={versions}
            />
          </div>
          <main className="col-span-8 lg:col-span-9 xl:col-span-7 docs">
            <div className="mx-auto md:mx-0 prose max-w-full main-docs-section">
              <h1>{title}</h1>
              <Documentation source={source} theme={themes.github} />
            </div>
          </main>
          <div className="hidden xl:block col-span-2 border-l border-gray-2/50 pl-5">
            <Toc contents={tocHeadings} maxHeadingLevel={2} />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(DocumentationPage)

function Documentation({ source, theme }) {
  const components = {
    Element: ({ name, ...props }) => {
      return (
        <Element
          // remove name from parent div
          name={props.children[0]?.props?.id === name ? null : name}
          {...props}
        />
      )
    },
    pre: (props) => <CodeBlock {...props} theme={theme} />,
    code: (props) => <InlineCode {...props} theme={theme} />,
    admonition: ({ title, type, ...props }) => <div className={"admonition " + type} title={title} {...props} theme={theme} />
  }

  return <MDXRemote {...source} components={components} theme={theme} />
}


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
  ctx.params.trailingSlash = true

  const props = await pageProps(ctx)

  // fetch content/*-docs folders as versions
  const dirs = await readdir(join(process.cwd(), 'content'))
  const docs = dirs.filter((d) => d.endsWith('docs') && d.startsWith('v'))
  props.versions = docs

  return { props }
}
