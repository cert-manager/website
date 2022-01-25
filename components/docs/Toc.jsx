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
      <div className="sticky top-4">
        <div className="flex flex-col flex-grow overflow-y-auto rounded-lg">
          <div className="flex items-center flex-shrink-0 px-2 pb-8">
            <div className="flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                <h4 className="text-blue-900 text-xs uppercase font-bold mt-6">
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
                      />
                    )
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    )
  )
}
