const TAB_TYPE = 'heading'

function renderTabs(tabs, nodes) {
  return [
    {
      type: 'jsx',
      value: `<Tabs>`
    },
    ...tabs.flatMap((tab) => {
      const label = nodes[tab.start].children[0].value
      const tabContent = nodes.slice(tab.start + 1, tab.end)
      return [
        {
          type: 'jsx',
          value: `<Tab label="${label}">`
        },
        ...tabContent,
        {
          type: 'jsx',
          value: `</Tab>`
        }
      ]
    }),
    {
      type: 'jsx',
      value: `</Tabs>`
    }
  ]
}

function findTabs(children, offset) {
  // E.g. `## Heading` vs `### Heading`
  const depthOfTabHeadings = children.find((c) => c.type === TAB_TYPE).depth

  return children.reduce((tabs, child, index) => {
    const lastTab = tabs.length > 0 && tabs[tabs.length - 1]

    if (child.type === TAB_TYPE && child.depth === depthOfTabHeadings) {
      if (tabs.length > 0) {
        lastTab.end = index + offset
      }
      const tab = {
        start: index + offset,
        // end is presumed last children, until other tab is found
        end: children.length + offset
      }
      return [...tabs, tab]
    }

    if (child.type === 'comment' && child.value.trim() === '/tabs') {
      // end comment
      lastTab.end = index + offset
    }
    return tabs
  }, [])
}

export default function remarkTabs() {
  return ({ children }) => {
    for (let index = 0; index < children.length; index++) {
      const child = children[index]
      if (child.type === 'comment' && child.value.trim() === 'tabs') {
        const relevantChildren = children.slice(index)
        const closingCommentIndex = relevantChildren.findIndex(
          (child) => child.type === 'comment' && child.value.trim() === '/tabs'
        )
        const tabs = findTabs(
          relevantChildren.slice(0, closingCommentIndex),
          index
        )

        if (tabs.length > 0) {
          const { start } = tabs[0]
          const { end } = tabs[tabs.length - 1]
          const nodes = renderTabs(tabs, children)
          children.splice(start, end - start, ...nodes)
          index += nodes.length
        }
      }
    }
  }
}
