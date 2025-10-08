import { Listbox } from '@headlessui/react'
import { useState } from 'react'
import SidebarLink from './Sidebar/SidebarLink'

import { compareVersions } from 'compare-versions'

function labelFromVersion(version) {
  return version === 'docs'
    ? 'latest'
    : version.replace(/-docs$/, '').replace(/^v/, '')
}

export default function VersionSelect({
  version,
  versions,
  setSidebarCollapsed,
  setParentOpen
}) {
  const [selectedVersion, setSelectedVersion] = useState(version)

  versions = versions
    .sort(function (first, second) {
      return compareVersions(labelFromVersion(first), labelFromVersion(second))
    })
    .reverse()
    .slice(0, 2) // Only show the last two releases in the dropdown list

  return (
    <div className="bg-gray-1 rounded-md border-2 border-gray-2/50">
      <Listbox value={selectedVersion} onChange={setSelectedVersion}>
        <Listbox.Button className="w-full">
          version: {labelFromVersion(version)}
        </Listbox.Button>
        <Listbox.Options>
          <Listbox.Option key={version} value={version}>
            <div className="block px-2">
              <SidebarLink
                href="docs"
                caption="latest"
                setSidebarCollapsed={setSidebarCollapsed}
                setParentOpen={setParentOpen}
              />
            </div>
          </Listbox.Option>
          {versions.map((version) => (
            <Listbox.Option key={version} value={version}>
              <div className="block px-2">
                <SidebarLink
                  href={version}
                  caption={labelFromVersion(version)}
                  setSidebarCollapsed={setSidebarCollapsed}
                  setParentOpen={setParentOpen}
                />
              </div>
            </Listbox.Option>
          ))}
          <div className="block px-2">
            <SidebarLink
              href="https://release-next--cert-manager.netlify.app/docs/"
              caption="next release"
              setSidebarCollapsed={setSidebarCollapsed}
              setParentOpen={setParentOpen}
            />
          </div>
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
