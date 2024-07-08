// This file originates from https://github.com/zentered/next-product-docs on
// the branch "feat/cert-manager-adjustments" (commit f4fb801), copyright
// Zentered 2022, licensed under the Apache 2.0 license.

import React from 'react'
import { Highlight } from 'prism-react-renderer'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useState } from 'react'

const copyIcon = (
  <svg
    className="docs-codeblock-copy-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
  </svg>
)
const doneIcon = (
  <svg
    className="docs-codeblock-done-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
    <path
      fillRule="evenodd"
      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
)

export default function CodeBlock({ children, theme = 'github' }) {
  const className = children.props.className || ''
  const [copied, setCopied] = useState(copyIcon)
  const language = className.replace(/language-/, '')
  const code = children.props.children.trim()

  return (
    <div className="relative">
      <Highlight
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <>
            <CopyToClipboard text={code} onCopy={() => setCopied(doneIcon)}>
              <button className="docs-codeblock-btn">{copied}</button>
            </CopyToClipboard>
            <pre className={`${className}`} style={{ ...style }}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          </>
        )}
      </Highlight>
    </div>
  )
}
