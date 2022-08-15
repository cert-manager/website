import { memo } from 'react'
import { Link } from 'react-scroll'
const activeClass = ''

const TocMenuItem = ({ slug, raw, text, isActive, onSetActive, className }) => {
  return (
    <li className={className}>
      <Link
        activeClass={activeClass}
        className={`text-sm text-blue-900 cursor-pointer no-underline ${
          isActive && activeClass
        }`}
        to={slug}
        spy={true}
        smooth={true}
        offset={0}
        duration={500}
        delay={10}
        onSetActive={(to) => onSetActive(to, raw)}
        title={text}
      >
        {text.replace(/`/g, '')}
      </Link>
    </li>
  )
}

export default memo(TocMenuItem)
