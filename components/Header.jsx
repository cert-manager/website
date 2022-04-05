import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import CertManagerLogo from './snippets/CertManagerLogo'
import { meta as site } from '../content/pages/site.mdx'

import { DocSearch } from '@docsearch/react'
import '@docsearch/css'

export default function Header() {
  const router = useRouter()
  const currentPath = router.pathname.replace('/[[...slug]]', '')

  return (
    <div className="bg-white">
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
                <DocSearch
                  appId={process.env.NEXT_PUBLIC_DOCS_SEARCH_APP_ID}
                  indexName={process.env.NEXT_PUBLIC_DOCS_SEARCH_INDEX_NAME}
                  apiKey={process.env.NEXT_PUBLIC_DOCS_SEARCH_API_KEY}
                />
              </li>
              <li>
                <Link href={site.navigation.cta.href}>
                  <a
                    onClick={() => closeMenu(setOpen)}
                    className="block btn-primary text-white font-montserrat font-bold text-sm uppercase py-2 px-5 rounded-5px"
                  >
                    {site.navigation.cta.text}
                  </a>
                </Link>
              </li>
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
          <DocSearch
            appId={process.env.NEXT_PUBLIC_DOCS_SEARCH_APP_ID}
            indexName={process.env.NEXT_PUBLIC_DOCS_SEARCH_INDEX_NAME}
            apiKey={process.env.NEXT_PUBLIC_DOCS_SEARCH_API_KEY}
          />
        </li>
        <li>
          <Link href={site.navigation.cta.href}>
            <a className="block btn-primary font-montserrat font-bold text-sm uppercase py-2 px-5 rounded-5px">
              {site.navigation.cta.text}
            </a>
          </Link>
        </li>
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
  active = active === '/[...docs]' ? '/docs' : active
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
