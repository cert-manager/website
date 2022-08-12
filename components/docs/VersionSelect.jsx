import { Listbox } from '@headlessui/react'
import { useState } from 'react'
import SidebarLink from './Sidebar/SidebarLink'
import Icon from 'components/Icon'

function labelFromVersion(version) {
    return (
        version === 'docs'
            ? 'latest'
            : version.replace(/-docs$/, '').replace(/^v/, '')
    );
}

export default function VersionSelect({
  version,
  versions,
  setSidebarCollapsed
}) {
  const [selectedVersion, setSelectedVersion] = useState(version)

  return (
      <div className="bg-gray-1 rounded-md border-2 border-gray-2/50">
      <Listbox value={selectedVersion} onChange={setSelectedVersion}>
        <Listbox.Button className="w-full">
          <Listbox.Label className="cursor-pointer">version: </Listbox.Label>{labelFromVersion(version)}
        </Listbox.Button>
        <Listbox.Options>
          <Listbox.Option key={version} value={version}>
            <div className="block px-2">
              <SidebarLink
                href="docs"
                caption="latest"
                setSidebarCollapsed={setSidebarCollapsed}
              />
            </div>
          </Listbox.Option>
          {versions.reverse().map((version) => (
            <Listbox.Option key={version} value={version}>
              <div className="block px-2">
                <SidebarLink
                  href={version}
                  caption={labelFromVersion(version)}
                  setSidebarCollapsed={setSidebarCollapsed}
                />
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
