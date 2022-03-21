import { Listbox } from '@headlessui/react'
import Link from 'next/link'
import { useState } from 'react'

export default function VersionSelect({ versions }) {
  const [selectedVersion, setSelectedVersion] = useState(versions[0])

  return (
    <div className="flex items-center gap-2">
      <Listbox value={selectedVersion} onChange={setSelectedVersion}>
        <Listbox.Button>{selectedVersion}</Listbox.Button>
        <Listbox.Options>
          {versions.map((version) => (
            <Listbox.Option key={version} value={version}>
              <Link href={`${version}`}>
                <a>{version}</a>
              </Link>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
