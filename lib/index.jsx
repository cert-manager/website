// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license.

/* eslint-disable react/display-name */
import React from 'react'
import { MDXRemote } from 'next-mdx-remote'
import { Element } from 'react-scroll'
import CodeBlock from 'components/docs/CodeBlock.jsx/index.js'
import InlineCode from 'components/InlineCode.jsx'

export function Documentation({ source, theme }) {
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
