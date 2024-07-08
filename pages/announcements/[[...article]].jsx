// You probably wonder why this file, [...docs].jsx, contains square brackets and
// dots. The reason is that the only way to do "dynamic routes" in Next.js is to
// use a file name containing square brackets and dots. You can learn more at:
// https://nextjs.org/docs/routing/dynamic-routes.

import { MDXRemote } from 'next-mdx-remote'
import { NextSeo } from 'next-seo'
import { withRouter } from 'next/router'
import { Element } from 'react-scroll'
import { themes } from 'prism-react-renderer'

import CodeBlock from 'components/docs/CodeBlock.jsx'
import InlineCode from 'components/docs/InlineCode.jsx'
import Toc from 'components/docs/Toc'

import getCurrentUrl from 'lib/currentUrl'
import { getArticles, pageProps } from 'lib/announcements'

import { meta as page } from 'content/pages/article.mdx'

const AnnouncementPage = ({
  router,
  title,
  source,
  tocHeadings,
  frontmatter,
  date,
  isIndex,
  articles
}) => {
  const currentUrl = getCurrentUrl(router)

  if (isIndex) {
    return <AnnouncementIndex articles={articles} />
  }
  
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
          <div className="col-span-4 lg:col-span-3 xl:col-span-3 md:border-r border-gray-2/50 pr-5"></div>
          <main className="col-span-8 lg:col-span-9 xl:col-span-7 docs">
            <div className="mx-auto md:mx-0 prose max-w-full main-docs-section">
              <h1>{title}</h1>
              <i>{date}</i>
              <Announcement source={source} theme={themes.github} />
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

function AnnouncementIndex({articles}) {
  return (
    <>
      <NextSeo
        title={page.title}
        description={page.description}
        canonical={'/announcements'}
        openGraph={{
          url: '/announcements',
          title: page.title,
          description: page.description
        }}
      />
      <div className="container mt-6 pb-48">
      <div className="w-full md:grid grid-cols-12 gap-12 xl:gap-16">
        <div className="col-span-4 lg:col-span-3 xl:col-span-3 md:border-r border-gray-2/50 pr-5"></div>
        <main className="col-span-8 lg:col-span-9 xl:col-span-7 docs">
          <div className="mx-auto md:mx-0 prose max-w-full main-docs-section">
              <h1>Announcements</h1>
              {articles.map((article) => (
                <a key={article.path} href={article.path} className="block my-2 !no-underline p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{article.title}</h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">{article.description}</p>
                    <p className="font-thin text-gray-700 dark:text-gray-400 italic">{article.date}</p>
                </a>
              ))}
          </div>
        </main>
        <div className="hidden xl:block col-span-2 border-l border-gray-2/50 pl-5"></div>
      </div>
    </div>
  </>
  )
}

export default withRouter(AnnouncementPage)

function Announcement({ source, theme }) {
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
    code: (props) => <InlineCode {...props} theme={theme} />
  }

  return <MDXRemote {...source} components={components} theme={theme} />
}

export async function getStaticPaths() {
  const articles = await getArticles()
  const paths = articles.map((article) => ({params: {article: article.slug}})).concat([{params: {article: []}}])
  return { paths, fallback: false }
}

export async function getStaticProps(ctx) {
  const isIndex = !ctx.params.article
  if (isIndex) {
    const articles = await getArticles()
    return {props: {
      isIndex: true,
      articles: articles.map(({title, description, path, date}) => ({title, description, path, date: date.toDateString()}))
    }}
  }

  const props = await pageProps(ctx)
  return { props }
}


