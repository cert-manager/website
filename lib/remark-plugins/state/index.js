function findVarsToSub(children) {
  const varsToSub = []

  const updatedChildren = children.reduce((arr, child) => {
    const isClosingInputComment =
      child.type === 'comment' &&
      child.value.trim().includes('/export-to-input')

    if (isClosingInputComment) {
      // find opening comment
      const numberOfElementsToRemove = [...arr].reverse().findIndex((c) => {
        return (
          c.type === 'comment' && c.value.trim().includes('export-to-input')
        )
      })

      const arrWithoutComment = arr.slice(0, -numberOfElementsToRemove)
      const markdownInComment = arr.slice(-numberOfElementsToRemove)

      const exportStatement = markdownInComment.find(
        (c) => c.value && c.value.includes('export')
      ).value

      const varToSub = `$${exportStatement.substring(
        exportStatement.lastIndexOf(' ') + 1,
        exportStatement.lastIndexOf('=')
      )}`

      varsToSub.push(varToSub)

      return arrWithoutComment.concat({
        type: 'jsx',
        value: `
          <input
            type="text"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md mb-5"
            value={substitutionState.${varToSub}}
            placeholder="${varToSub}"
            onChange={(event) => setSubstitutionState({ ${varToSub}: event.currentTarget.value})}
          />
        `
      })
    }

    return [...arr, child]
  }, [])

  children.splice(0, children.length, ...updatedChildren)

  return varsToSub
}

export default function remarkState() {
  return ({ children }) => {
    const varsToSub = findVarsToSub(children)
    const varsToSubWithDefaultValue = varsToSub.map((vts) => `"${vts}": ""`)
    const substitutionState = `
      {
        ${varsToSubWithDefaultValue.join(', ')}
      }
    `

    children.unshift(
      {
        type: 'jsx',
        value: `<State initialstate={${substitutionState}}>`
      },
      {
        type: 'jsx',
        value: `{({setState: setSubstitutionState, ...substitutionState}) => (`
      },
      {
        type: 'jsx',
        value: `<>`
      },
      {
        type: 'jsx',
        value: `<Interpolate substitutions={substitutionState}>`
      }
    )

    children.push(
      {
        type: 'jsx',
        value: '</Interpolate>'
      },
      {
        type: 'jsx',
        value: '</>'
      },
      {
        type: 'jsx',
        value: ')}'
      },
      {
        type: 'jsx',
        value: `</State>`
      }
    )
  }
}
