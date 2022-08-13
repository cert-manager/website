import TocMenuItem from './TocMenuItem'
import useHighLightLinks from './useHighLightLinks'

export default function Toc({ contents }) {
  const {
    firstLevelActiveLink,
    thirdLevelActiveLink,
    secondLevelActiveLink,
    onSetActive
  } = useHighLightLinks()

  return (
    contents.length > 0 && (
        <nav className="sticky top-4">
          <h4 className="text-blue-900 text-xs uppercase font-bold mb-2">
            On this page
          </h4>
          <ul>
            {contents.map((item) => {
                return (
                    <TocMenuItem
                      key={item.slug}
                      slug={item.slug}
                      raw={item.raw}
                      text={item.text}
                      isActive={
                          firstLevelActiveLink === item.slug ||
                              thirdLevelActiveLink === item.slug ||
                              secondLevelActiveLink === item.slug
                      }
                      onSetActive={onSetActive}
                      className="whitespace-nowrap mb-2"
                    />
                )
            })}
          </ul>
        </nav>
    )
  )
}
