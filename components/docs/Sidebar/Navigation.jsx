import Link from 'next/link'
import { useRouter } from 'next/router'
import { connectStateResults } from 'react-instantsearch-dom'
import { useState } from 'react'
import classNames from 'classnames'
import Icon from '../../Icon'

function Dropdown({ setSidebarCollapsed, routes, parentOpen = true}) {
  const [open, setOpen] = useState(false)
  const iconClasses = classNames({
    'block w-4 h-4 transform text-blue-1': true,
    'rotate-180': open
  })

  return (
    <div className='mt-4'>
      <button
        tabIndex={parentOpen ? 0 : -1}
        className="relative text-blue-800 text-base font-medium w-full text-left flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className='block'>
          {routes.title}
        </span>
        <span className={iconClasses}>
          <Icon name="chevronDown" />
        </span>
      </button>
      <ul className={open ? 'h-auto pl-4 border-l border-gray-2/40' : 'h-0 overflow-y-hidden'}>
        {routes.routes.map((r, idx) => {
          if (!r.path) {
            return <Dropdown routes={r} parentOpen={open} sidebarCollapsed={setSidebarCollapsed} key={`${r.title}-${idx}`} />
          } else {
            return (
              <li key={`${r.path}-${idx}`}>
                <SidebarLink
                  route={r}
                  parentOpen={open}
                  onClick={() => setSidebarCollapsed(true)}
                />
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}

function ListItems({ setSidebarCollapsed, routes }) {
  if (!routes) return null
  return routes.map((r, idx) => {
    if (!r.path) {
      return (
        <li key={`${r.title}-${idx}`}>
          <Dropdown routes={r} setSidebarCollapsed={setSidebarCollapsed} />
        </li>
      )
    } else {
      return (
        <li key={`${r.path}-${idx}`}>
          <SidebarLink route={r} onClick={() => setSidebarCollapsed(true)} />
        </li>
      )
    }
  })
}

function SidebarLink({ route, parentOpen = true, onClick }) {
  const router = useRouter()
  const active = router.asPath === route.path + '/'
  const linkClasses = classNames({
    'flex text-dark-2 hover:text-blue-2 text-base py-2 transition ease-in-out duration-150 no-underline': true,
    'font-medium opacity-60 w-full': active
  })
  return (
    <Link href={route.path}>
      <a onClick={onClick} className={linkClasses} tabIndex={parentOpen ? 0 : -1 }>
        {route.title}
      </a>
    </Link>
  )
}

const Navigation = connectStateResults(
  ({
    routes,
    searchResults,
    setSidebarCollapsed,
    sidebarCollapsed,
    showSearchResults
  }) => {
    const hasResults = searchResults && searchResults.nbHits !== 0

    return (
      !(hasResults && showSearchResults) && (
        <nav className="sidebar__nav flex-1 px-2 space-y-1">
          {routes &&
            Object.values(routes).map((obj, idx) => {
              return (
                <div
                  className={sidebarCollapsed ? 'hidden md:block' : 'block'}
                  key={`sidebar-${idx}`}
                >
                  <h3 className="text-blue-800 text-lg font-medium mt-4">
                    {obj.title}
                  </h3>
                  <ul>
                    <ListItems
                      setSidebarCollapsed={setSidebarCollapsed}
                      routes={obj.routes}
                    />
                  </ul>
                </div>
              )
            })}
        </nav>
      )
    )
  }
)
export default Navigation
