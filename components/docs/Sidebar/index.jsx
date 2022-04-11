import React, { useState } from 'react'
import ClickAwayListener from 'react-click-away-listener'
import { useRouter } from 'next/router'

import MenuButton from './MenuButton'
import Navigation from './Navigation'

import AlgoliaSearch from 'components/AlgoliaSearch'
import AlgoliaClient from 'lib/algolia-client'
import { indexName } from 'lib/instantsearch'
import VersionSelect from '../VersionSelect'
const searchClient = new AlgoliaClient()
const filterHits = (item) => item.path.includes('/docs')

export default function Sidebar({ routes }) {
  const router = useRouter()
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push({
      pathname: '/search',
      query: `search=${inputRef.current.value}`
    })
  }

  return (
    <div className="flex-none ">
      <div className="sticky top-4  overflow-y-auto">
        <div className="">
          <aside className="">
            <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
              <div>
                <div className='lg:hidden mb-8'>
                  <VersionSelect />
                </div>
                <AlgoliaSearch
                  indexName={indexName}
                  searchClient={searchClient}
                  onAutoCompleteFocus={() => setShowSearchResults(true)}
                  showSearchResults={showSearchResults}
                  onClickResult={() => setShowSearchResults(false)}
                  handleSubmit={handleSubmit}
                  formClassName="md:hidden"
                  hitsClassName="sidebar__nav"
                  filterHits={filterHits}
                >
                  <MenuButton
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    isOpen={sidebarCollapsed}
                  />
                  <Navigation
                    routes={routes}
                    setSidebarCollapsed={setSidebarCollapsed}
                    sidebarCollapsed={sidebarCollapsed}
                    showSearchResults={showSearchResults}
                  />
                </AlgoliaSearch>
              </div>
            </ClickAwayListener>
          </aside>
        </div>
      </div>
    </div>
  )
}
