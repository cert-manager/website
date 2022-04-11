import ClickAwayListener from 'react-click-away-listener'

import AlgoliaSearch from 'components/AlgoliaSearch'
import AlgoliaClient from 'lib/algolia-client'
import { indexName } from 'lib/instantsearch'
const searchClient = new AlgoliaClient()
const filterHits = (item) => item.path.includes('/docs')

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import VersionSelect from './docs/VersionSelect'
import CertManagerLogo from './snippets/CertManagerLogo'
import { meta as site } from '../content/pages/site.mdx'

export default function Header() {
  const router = useRouter()
  const currentPath = router.pathname.replace('/[[...slug]]', '')

  return (
    <div className="bg-white">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="paint0_linear_63_52"
            x1="6.50769"
            y1="2.7"
            x2="15.4024"
            y2="11.6052"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#326CE5" />
            <stop offset="1" stopColor="#5545D3" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative container py-3 flex justify-between items-center">
        <Link href="/">
          <a>
            <CertManagerLogo />
          </a>
        </Link>
        <div>
          <DesktopNavigation active={currentPath} className="hidden lg:block" />
          <MobileNavigation active={currentPath} className="lg:hidden" />
        </div>
      </div>
    </div>
  )
}

function MobileNavigation({ active, className = '' }) {
  const [open, setOpen] = useState(false)
  const classNames = open ? 'top-65px' : '-top-1000px'

  return (
    <div className={className}>
      <button
        onClick={() => setOpen(!open)}
        className={`${open ? 'text-pink' : 'text-blue-1'}`}
      >
        <BarsIcon />
      </button>
      <nav
        className={`absolute left-0 z-1000 ${classNames}`}
        style={{ marginLeft: '4%', marginRight: '4%', width: '92%' }}
      >
        <div className="bg-white flex justify-between shadow-inner pt-6 pb-8 px-5">
          <div>
            <ul className="space-y-4">
              {site.navigation.items.map((item) => (
                <NavItem
                  active={active}
                  item={item}
                  key={item.href}
                  setOpen={setOpen}
                />
              ))}
            </ul>
          </div>
          <div>
            <ul className="flex flex-col justify-between items-end max-w-200px h-full">
              <li className="max-w-full">
                <Search />
              </li>
              {active !== '/docs' && (
                <li>
                  <Link href={site.navigation.cta.href}>
                    <a
                      onClick={() => closeMenu(setOpen)}
                      className="block btn-gradient text-white font-montserrat font-bold text-sm uppercase py-2 px-5 rounded-5px"
                    >
                      {site.navigation.cta.text}
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}

function DesktopNavigation({ active, className = '' }) {
  return (
    <nav className={className}>
      <ul className="flex items-center space-x-8">
        {site.navigation.items.map((item) => (
          <NavItem active={active} item={item} key={item.href} />
        ))}
        <li className="">
          <Search />
        </li>
        {active !== '/docs' && (
          <li>
            <Link href={site.navigation.cta.href}>
              <a className="block btn-gradient text-white font-montserrat font-bold text-sm uppercase py-2 px-5 rounded-5px">
                {site.navigation.cta.text}
              </a>
            </Link>
          </li>
        )}
        {active === '/docs' && (
          <li>
            <VersionSelect />
          </li>
        )}
      </ul>
    </nav>
  )
}

function BarsIcon() {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 20 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="20" height="3.15789" rx="1.57895" fill="currentColor" />
      <rect
        y="6.84229"
        width="20"
        height="3.15789"
        rx="1.57895"
        fill="currentColor"
      />
      <rect
        y="13.6841"
        width="20"
        height="3.15789"
        rx="1.57895"
        fill="currentColor"
      />
    </svg>
  )
}

function closeMenu(setOpen) {
  // we have to check because on desktop this in not used
  if (setOpen) {
    setOpen(false)
  }
}

function NavItem({ active, item, setOpen = null }) {
  const isActive = active === item.href
  return (
    <li key={item.href}>
      <Link href={item.href}>
        <a
          onClick={() => closeMenu(setOpen)}
          className={`block relative text-sm uppercase font-montserrat font-semibold tracking-wide no-underline ${
            isActive && 'text-blue-1'
          }`}
        >
          {item.text}
          {isActive && (
            <span className="block absolute top-6 left-0 w-33px h-3px bg-blue-1"></span>
          )}
        </a>
      </Link>
    </li>
  )
}

function Search() {
  const router = useRouter()
  const [showSearchResults, setShowSearchResults] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push({
      pathname: '/search',
      query: `search=${inputRef.current.value}`
    })
  }

  return (
    <div className="inline-block max-w-full">
      <ClickAwayListener onClickAway={() => setShowSearchResults(false)}>
        <div>
          <AlgoliaSearch
            indexName={indexName}
            searchClient={searchClient}
            onAutoCompleteFocus={() => setShowSearchResults(true)}
            showSearchResults={showSearchResults}
            onClickResult={() => setShowSearchResults(false)}
            handleSubmit={handleSubmit}
            hitsClassName="header__hits"
            filterHits={filterHits}
          ></AlgoliaSearch>
        </div>
      </ClickAwayListener>
    </div>
  )
}
