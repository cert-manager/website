import React from 'react'
import github from 'prism-react-renderer/themes/github'

export default function InlineCode({ className, children, theme = github }) {
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
