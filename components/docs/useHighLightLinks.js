import { useState, useEffect, useCallback } from 'react'

const isThirdLevelLink = (raw) => {
  return raw.includes('###')
}

const isSecondLevelLink = (raw) => {
  return raw.includes('##') && !isThirdLevelLink(raw)
}

const isFirstLevel = (raw) => {
  return raw.includes('#') && !isThirdLevelLink(raw) && !isSecondLevelLink(raw)
}

export default function useHighLightLinks() {
  const [firstLevelActiveLink, setFirstLevelActiveLink] = useState('')
  const [secondLevelActiveLink, setSecondLevelActiveLink] = useState('')
  const [thirdLevelActiveLink, setThirdLevelActiveLink] = useState('')

  const pushHash = (to) => {
    history.pushState(null, '', to)
  }

  const highlightFirstLink = (to) => {
    setFirstLevelActiveLink(to)
    setSecondLevelActiveLink('')
    setThirdLevelActiveLink('')
  }

  const onSetActive = useCallback(
    (to, raw) => {
      if (isFirstLevel(raw)) {
        highlightFirstLink(to)
      }
      if (isSecondLevelLink(raw)) setSecondLevelActiveLink(to)
      if (isThirdLevelLink(raw)) setThirdLevelActiveLink(to)
      if (!global.location.href.includes(to)) pushHash(`#${to}`)
    },
    [firstLevelActiveLink]
  )

  useEffect(() => {
    setThirdLevelActiveLink('')
  }, [secondLevelActiveLink])

  return {
    firstLevelActiveLink,
    secondLevelActiveLink,
    thirdLevelActiveLink,
    onSetActive
  }
}
