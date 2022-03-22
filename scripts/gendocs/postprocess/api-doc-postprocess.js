#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs'
import prettier from 'prettier'
import matter from 'gray-matter'

const apiDocsFile = readFileSync(0, 'utf8')

const { content, data } = matter(apiDocsFile)
let result = content
result = prettier.format(`<div>${result}</div>`, {
  parser: 'babel',
  htmlWhitespaceSensitivity: 'strict',
  proseWrap: 'never',
  quoteProps: 'consistent',
  bracketSameLine: true,
  printWidth: 1000
})

result = result.split('\n').slice(1, -2).join('\n')
result = result.replace(new RegExp(/{" "}/g), ' ')

result = prettier.format(result, {
  parser: 'html',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  quoteProps: 'consistent',
  bracketSameLine: true,
  printWidth: 1000
})

writeFileSync(1, matter.stringify(result, data))
