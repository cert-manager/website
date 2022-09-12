import { Children } from 'react'

const replaceChildContent = (children, substitutions) => {
  const modifiedChildren = Children.map(children, (child) => {
    if (typeof child === 'string') {
      return Object.entries(substitutions).reduce(
        (str, [toReplace, replaceWith]) =>
          str.replace(toReplace, replaceWith || toReplace),
        child
      )
    }

    if (!child.props?.children) {
      return child
    }

    return {
      ...child,
      props: {
        ...child.props,
        children: replaceChildContent(child.props.children, substitutions)
      }
    }
  })

  return modifiedChildren.length === 1 ? modifiedChildren[0] : modifiedChildren
}

const Interpolate = ({ children, substitutions }) => {
  const modifiedChildren = replaceChildContent(children, substitutions)
  return modifiedChildren
}

export default Interpolate
