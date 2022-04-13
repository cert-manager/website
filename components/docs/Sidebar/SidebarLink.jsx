import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from 'classnames'

export default function SidebarLink({
  href,
  caption,
  parentOpen = true,
  setSidebarCollapsed
}) {
  const router = useRouter()
  const active = router.asPath === href + '/'
  const linkClasses = classNames({
    'flex text-dark-2 hover:text-blue-2 text-base py-2 transition ease-in-out duration-150 no-underline': true,
    'font-medium opacity-60 w-full': active
  })
  return (
    <Link href={href}>
      <a
        className={linkClasses}
        tabIndex={parentOpen ? 0 : -1}
        onClick={() => setSidebarCollapsed(true)}
      >
        {caption}
      </a>
    </Link>
  )
}
