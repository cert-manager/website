import Link from 'next/link'
import Icon from '../components/Icon'
import classNames from 'classnames'

export default function Button({
  icon = '',
  caption,
  href,
  className = '',
  target
}) {
  const styles = classNames({
    'inline-block px-10 py-4': !icon,
    'inline-flex items-center gap-3 px-4 py-10px': icon
  })

  return (
    <Link href={href}>
      <a
        target={target || '_self'}
        className={`font-montserrat font-bold uppercase text-sm text-white leading-20px btn-gradient rounded-5px ${styles} ${className}`}
      >
        <span className="block w-8">{icon && <Icon name={icon} />}</span>
        <span>{caption}</span>
      </a>
    </Link>
  )
}
