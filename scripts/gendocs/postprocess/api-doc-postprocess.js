#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import prettier from 'prettier'

// matter is used to split front-matter from the main doc content
import matter from 'gray-matter'

const apiDocsFile = readFileSync(0, 'utf8')

const { content, data } = matter(apiDocsFile)

let result = content

result = await prettier.format(`<div>${result}</div>`, {
  parser: 'babel',
  htmlWhitespaceSensitivity: 'strict',
  proseWrap: 'never',
  quoteProps: 'consistent',
  bracketSameLine: true,
  printWidth: 1000
})

result = result.split('\n').slice(1, -2).join('\n')
result = result.replace(new RegExp(/{" "}/g), ' ')

result = await prettier.format(result, {
  parser: 'html',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  quoteProps: 'consistent',
  bracketSameLine: true,
  printWidth: 1000
})

// The babel→HTML prettier pipeline inserts whitespace inside <p> tags
// (babel reformats "<p>(" to "<p>\n  (" which the HTML pass collapses to
// "<p> ("). Strip these cosmetic spaces since <p> is a block element.
result = result.replace(/<p>\s+/g, '<p>').replace(/\s+<\/p>/g, '</p>')

writeFileSync(1, matter.stringify(result, data))
