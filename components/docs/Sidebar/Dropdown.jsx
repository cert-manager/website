import { useState } from 'react'
import classNames from 'classnames'
import Icon from 'components/Icon'
import SidebarLink from './SidebarLink'

export default function Dropdown({
  routes,
  parentOpen = true,
  setSidebarCollapsed
}) {
  const [open, setOpen] = useState(false)
  const iconClasses = classNames({
    'block w-4 h-4 transform text-blue-1': true,
    'rotate-180': open
  })

  return (
    <div className="mt-4">
      <button
        tabIndex={parentOpen ? 0 : -1}
        className="relative text-blue-800 text-base font-medium w-full text-left flex items-center justify-between"
        onClick={() => setOpen(!open)}
      >
        <span className="block">{routes.title}</span>
        <span className={iconClasses}>
          <Icon name="chevronDown" />
        </span>
      </button>
      <ul
        className={
          open
            ? 'h-auto pl-4 border-l border-gray-2/40'
            : 'h-0 overflow-y-hidden'
        }
      >
        {routes.routes.map((r, idx) => {
          if (!r.path) {
            return (
              <Dropdown
                routes={r}
                parentOpen={open}
                key={`${r.title}-${idx}`}
                setSidebarCollapsed={setSidebarCollapsed}
              />
            )
          } else {
            return (
              <li key={`${r.path}-${idx}`}>
                <SidebarLink
                  href={r.path}
                  caption={r.title}
                  parentOpen={open}
                  setSidebarCollapsed={setSidebarCollapsed}
                />
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
