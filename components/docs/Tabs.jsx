import React, { useState } from 'react'

export const Tab = ({ children }) => {
  return <div>{children}</div>
}

const MobileTabs = ({ className, options, value, onChange }) => (
  <div className={className}>
    <select
      value={value}
      onChange={onChange}
      id="tabs"
      className="docs-tabs-mobile-select"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
)

const DesktopTabs = ({ className, options, value, onChange }) => (
  <div className={className}>
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {options.map((opt) => {
          const notSelectedClasses =
            'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          const selectedClasses = 'border-indigo-500 text-indigo-600'

          const extraClasses =
            opt === value ? selectedClasses : notSelectedClasses

          return (
            <span
              key={opt}
              className={`cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${extraClasses}`}
              onClick={() => onChange(opt)}
            >
              {opt}
            </span>
          )
        })}
      </nav>
    </div>
  </div>
)

export default function Tabs({ children }) {
  const childArray = React.Children.toArray(children)
  const [selected, setSelected] = useState(childArray[0].props.label)
  const labels = childArray.map((child) => child.props.label)
  return (
    <div>
      <div>
        <MobileTabs
          className="sm:hidden"
          value={selected}
          options={labels}
          onChange={(label) => setSelected(label)}
        />
        <DesktopTabs
          className="hidden sm:block"
          value={selected}
          options={labels}
          onChange={(label) => setSelected(label)}
        />
      </div>
      {childArray.find((child) => child.props.label === selected)}
    </div>
  )
}
