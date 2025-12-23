import { useState } from 'react'
import classNames from 'classnames'
import ListItems from './ListItems'
import Icon from 'components/Icon'
import VersionSelect from 'components/docs/VersionSelect'

export default function Sidebar({ router, routes, versions }) {
  let version = 'docs'
  if (router.query?.docsFolder) {
    version = router.query.docsFolder
  } else {
    version = router.query?.docs.length >= 0 ? router.query.docs[0] : 'docs'
  }
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const iconClasses = classNames({
    'block w-4 h-4 transform text-blue-1': true,
    'rotate-180': !sidebarCollapsed
  })

  return (
    <div className="flex-none">
      <div className="sticky top-4">
        <button
          className="md:hidden mb-4 px-2 border-b border-gray-2 relative text-base font-medium w-full text-left flex items-center justify-between cursor-pointer"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          <span className="block">Docs Menu</span>
          <span className={iconClasses}>
            <Icon name="chevronDown" />
          </span>
        </button>
        <div className={sidebarCollapsed ? 'hidden md:block' : 'block'}>
          <aside className="">
            <nav className="flex-1 px-2 space-y-1">
              {routes &&
                Object.keys(routes).map((route, idx) => {
                  const obj = routes[route]
                  return (
                    <div key={`sidebar-${idx}`}>
                      <ul>
                        <ListItems
                          routes={obj.routes}
                          setSidebarCollapsed={setSidebarCollapsed}
                          setParentOpen={() => {}}
                        />
                      </ul>
                    </div>
                  )
                })}
            </nav>
            <div className="mt-8">
              <VersionSelect
                version={version}
                versions={versions}
                setSidebarCollapsed={setSidebarCollapsed}
                setParentOpen={() => {}}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
