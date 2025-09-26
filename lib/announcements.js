import { getRawFile } from 'lib/files'
import { join } from 'path'
import { readdir } from 'fs/promises'
import { VFile } from 'vfile'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import { marked } from 'marked'
import GithubSlugger from 'github-slugger'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'

import { codeImport as remarkCodeImport } from 'remark-code-import'
import remarkInlineLinks from 'remark-inline-links'
import remarkGfm from 'remark-gfm'
import remarkHeadingId from 'lib/remark-plugins/heading-ids'
import rehypeExternalLinks from 'rehype-external-links'
import remarkRewriteImages from 'lib/remark-plugins/images'


export async function getArticles() {
  const files = await readdir(join(process.cwd(), 'content', 'announcements'));
  const paths = await Promise.all(
    files.map(async (file) => {
      const rawFileContents = await getRawFile(join('announcements', file));
      const { data } = matter(rawFileContents);
      const date = new Date(data.date);
      const slug = getSlug(date, data.slug)

      return {
        title: data.title,
        description: data.description,
        date: date,
        path: slug.join("/"),
        slug: slug,
        file: file,
      }
    }
  ))

  paths.sort((a, b) => new Date(b.date) - new Date(a.date))

  return paths
}

export async function pageProps({params}) {
  const articles = await getArticles()
  const article = articles.find((article) => article.path == params.article.join("/"))
  if (!article) return {
    notFound: true
  }

  const path = join('announcements', article.file)
  const mdxPathAbsolute = join(process.cwd(), 'content', path)
  const mdxRawContent = await getRawFile(path)
  const { content, data } = matter(mdxRawContent)
  if (!data.title) {
    data.title = ''
  }
  
  const slugger = new GithubSlugger()
  const mdxSource = await serialize(
    new VFile({
      value: content,
      path: mdxPathAbsolute
    }),
    {
      parseFrontmatter: false,
      scope: { data },
      mdxOptions: {
        mdExtensions: [],
        mdxExtensions: ['.md', '.mdx'],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolink,
            {
              behavior: 'append',
              properties: {
                className: ['btn-copy-link', 'invisible']
              },
              content: {
                type: 'element',
                tagName: 'svg',
                properties: {
                  className: ['h-6', 'w-6', 'ml-2', 'docs-copy-btn'],
                  xmlns: 'http://www.w3.org/2000/svg',
                  fill: 'none',
                  viewBox: '0 0 24 24',
                  stroke: 'currentColor'
                },
                children: [
                  {
                    type: 'element',
                    tagName: 'path',
                    properties: {
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: 2,
                      d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                    },
                    children: []
                  }
                ]
              }
            }
          ]
        ],
        remarkPlugins: [
          remarkHeadingId,
          remarkGfm,
          remarkCodeImport,
          [
            remarkRewriteImages,
            { destination: process.env.ASSETS_DESTINATION }
          ],
          remarkInlineLinks,
          [rehypeExternalLinks, { target: false, rel: ['nofollow'] }],
        ]
      },
      target: ['esnext']
    }
  )
  
  const markdownTokens = marked.lexer(content)
  const headings = markdownTokens
    .filter((t) => t.type === 'heading')
    .map((heading) => {
      heading.slug = slugger.slug(heading.text)
      return heading
    })

  const firstHeadingText =
    headings && headings.length > 0 ? headings[0].text : ''
  const title = data.title.length > 0 ? data.title : firstHeadingText

  return {
    title,
    date: article.date.toDateString(),
    frontmatter: data,
    source: mdxSource,
    tocHeadings: headings,
  }
}

function getSlug(date, slug) {
  return [
    '' + date.getFullYear(),
    ('0' + (date.getMonth()+1)).slice(-2),
    ('0' + date.getDate()).slice(-2),
    slug,
  ]
} 
