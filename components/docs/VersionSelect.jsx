import { Listbox } from '@headlessui/react'
import { useState } from 'react'
import SidebarLink from './Sidebar/SidebarLink'
import Icon from 'components/Icon'

export default function VersionSelect({
  version,
  versions,
  setSidebarCollapsed
}) {
  const [selectedVersion, setSelectedVersion] = useState(version)

  return (
    <div className="">
      <Listbox value={selectedVersion} onChange={setSelectedVersion}>
        <Listbox.Button className="flex items-center justify-between px-2 w-full">
          <span className="block">{selectedVersion}</span>
          <span className="block h-4 w-4 text-blue-1">
            <Icon name="chevronDown" />
          </span>
        </Listbox.Button>
        <Listbox.Options>
          {versions.map((version) => (
            <Listbox.Option key={version} value={version}>
              <div className="block px-2">
                <SidebarLink
                  href={version}
                  caption={version}
                  setSidebarCollapsed={setSidebarCollapsed}
                />
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
