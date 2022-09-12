import GithubSlugger from 'github-slugger'

const hasUnclosedSectionTag = (children) => {
  const amountOpeningTags = children.filter(
    (c) => c.value && c.value.includes('<Element')
  ).length
  const amountClosingTags = children.filter(
    (c) => c.value && c.value.includes('</Element')
  ).length
  return amountOpeningTags > amountClosingTags
}

const insertSections = (children, slugger, depth = 6) => {
  if (depth === 0) {
    while (hasUnclosedSectionTag(children)) {
      children.push({
        type: 'jsx',
        value: `</Element>`
      })
    }
    return children
  }
  const newChildren = children.reduce((arr, child) => {
    const childrenToAdd = []

    if (child.type === 'heading' && child.depth <= depth) {
      const needsClosingSection = hasUnclosedSectionTag(arr)

      if (needsClosingSection) {
        childrenToAdd.push({
          type: 'jsx',
          value: `</Element>`
        })
      }
    }
    if (child.type === 'heading' && child.depth === depth) {
      childrenToAdd.push({
        type: 'jsx',
        value: `<Element name="${slugger.slug(child.children[0].value)}">`,
        depth: child.depth
      })
    }

    childrenToAdd.push(child)

    return [...arr, ...childrenToAdd]
  }, [])
  return insertSections(newChildren, slugger, depth - 1)
}

export default function remarkTabs() {
  return ({ children }) => {
    const slugger = new GithubSlugger()
    const newChildren = insertSections(children, slugger, 2)
    children.splice(0, children.length, ...newChildren)
  }
}
