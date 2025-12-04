import { useState } from 'react'
import classNames from 'classnames'
import Icon from 'components/Icon'
import SidebarLink from './SidebarLink'

export default function Dropdown({
  routes,
  parentOpen = true,
  setSidebarCollapsed,
  setParentOpen
}) {
  const [open, setSelfOpen] = useState(false)
  const setOpen = (v) => {
    if (v) setParentOpen(v)
    setSelfOpen(v)
  }
  const iconClasses = classNames({
    'block w-4 h-4 transform text-blue-1': true,
    'rotate-180': open
  })

  return (
    <div className="pt-2 pb-2">
      <button
        tabIndex={parentOpen ? 0 : -1}
        className="relative text-base font-medium w-full text-left flex items-center justify-between cursor-pointer"
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
              <li key={`${r.title}-${idx}`}>
                  <Dropdown
                    routes={r}
                    parentOpen={open}
                    key={`${r.title}-${idx}`}
                    setSidebarCollapsed={setSidebarCollapsed}
                    setParentOpen={setOpen}
                  />
              </li>
            )
          } else {
            return (
              <li key={`${r.path}-${idx}`}>
                <SidebarLink
                  href={r.path}
                  caption={r.title}
                  parentOpen={open}
                  setSidebarCollapsed={setSidebarCollapsed}
                  setParentOpen={setOpen}
                />
              </li>
            )
          }
        })}
      </ul>
    </div>
  )
}
