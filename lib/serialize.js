// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license.

import { VFile } from 'vfile'
import { serialize } from 'next-mdx-remote/serialize'
import matter from 'gray-matter'
import { marked } from 'marked'
import GithubSlugger from 'github-slugger'
import rehypeSlug from 'rehype-slug'
import rehypeAutolink from 'rehype-autolink-headings'
import cloneDeep from 'lodash/cloneDeep'
import stdpath from 'path'

import { codeImport as remarkCodeImport } from 'remark-code-import'
import remarkInlineLinks from 'remark-inline-links'
import remarkGfm from 'remark-gfm'
import remarkHeadingId from 'lib/remark-plugins/heading-ids'
import rehypeExternalLinks from 'rehype-external-links'
import remarkInternalLinks from 'lib/remark-plugins/links'
import remarkRewriteImages from 'lib/remark-plugins/images'
import remarkVariable from 'lib/remark-plugins/variable'
import {
  findRouteByPath,
  replaceDefaultPath,
  getSlug,
  getPaths,
  fetchDocsManifest,
  fetchDocsVariables
} from 'lib/docs'
import { getRawFile } from 'lib/files'

export async function pageProps({ params }) {
  const docsFolder = params.docsFolder
    ? params.docsFolder
    : process.env.DOCS_FOLDER
  const trailingSlash = params.trailingSlash || false

  const slugger = new GithubSlugger()
  const manifest = await fetchDocsManifest(docsFolder).catch((error) => {
    if (error.status === 404 || error.code === 'ENOENT') return
    throw error
  })
  const variables = await fetchDocsVariables(docsFolder).catch((error) => {
    if (error.status === 404 || error.code === 'ENOENT') return
    throw error
  })
  const { slug } = getSlug(params)
  const route = manifest && findRouteByPath(slug, manifest.routes)
  if (!route)
    return {
      notFound: true
    }
  const manifestRoutes = cloneDeep(manifest.routes)
  replaceDefaultPath(manifestRoutes)

  const mdxRawContent = await getRawFile(route.path)
  const { content, data } = matter(mdxRawContent)
  if (!data.title) {
    data.title = ''
  }

  const mdxPathAbsolute = stdpath.join(process.cwd(), 'content', route.path)

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
          [
            remarkInternalLinks,
            {
              prefix: docsFolder,
              extensions: ['.mdx', '.md'],
              trailingSlash: trailingSlash,
              rootPath: route.path,
              debug: (process.env.DEBUG === 'true')
            }
          ],
          [
            remarkVariable,
            {
              replacements: variables,
            }
          ]
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
    frontmatter: data,
    sidebarRoutes: manifestRoutes,
    route,
    source: mdxSource,
    tocHeadings: headings
  }
}

export async function staticPaths(params) {
  const docsFolder = params?.docsFolder
    ? params.docsFolder
    : process.env.DOCS_FOLDER

  const manifest = await fetchDocsManifest(docsFolder)
  const paths = getPaths(manifest.routes)
  paths.shift() // remove trailing README
  paths.unshift(`/${docsFolder}`)
  return paths
}
