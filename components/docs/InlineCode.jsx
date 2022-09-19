// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license.

import React from 'react'

export default function InlineCode({ className, children, theme }) {
  return (
    <code
      className={className}
      style={{
        color: theme.plain.color,
        // stylelint-disable-next-line value-keyword-case
        backgroundColor: theme.plain.backgroundColor,
        padding: '0.2em 0.4em',
        borderRadius: '6px',
        margin: 0,
        fontSize: '85%',
        fontWeight: 'unset'
      }}
    >
      {children}
    </code>
  )
}
