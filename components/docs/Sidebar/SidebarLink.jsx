import React, { useEffect } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

export default function SidebarLink({
  href,
  caption,
  parentOpen = true,
  setSidebarCollapsed,
  setParentOpen
}) {
  const router = useRouter()
  const active = router.asPath.split('?')[0].split('#')[0] === href + '/'
  const linkClasses = classNames({
    'flex text-dark-2 hover:text-blue-2 text-base py-2 transition ease-in-out duration-150 no-underline': true,
    'font-medium opacity-60 w-full': active
  })

  useEffect(() => {
    if (active) setParentOpen(true)
  }, []);

  return (
    (<Link
      href={href}
      className={linkClasses}
      tabIndex={parentOpen ? 0 : -1}
      onClick={() => setSidebarCollapsed(true)}>

      {caption}

    </Link>)
  );
}
