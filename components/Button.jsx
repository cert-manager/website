import Link from 'next/link'
import Icon from '../components/Icon'
import classNames from 'classnames'

export default function Button({
  icon = '',
  iconWClass = 'w-8',
  caption,
  href,
  className = '',
  rel = null,
  target
}) {
  const styles = classNames(
    'font-montserrat font-bold uppercase text-sm leading-[20px] btn-primary rounded-[5px]',
    {
      'inline-block px-10 py-4': !icon,
      'inline-flex items-center gap-3 px-4 py-[10px]': icon,
    },
    className,
  )

  return (
    (<Link
      href={href}
      target={target || '_self'}
      rel={rel}
      className={styles}>

      <span className={"block " + iconWClass}>{icon && <Icon name={icon} inline={true} />}</span>
      <span>{caption}</span>

    </Link>)
  );
}
