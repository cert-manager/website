import { memo } from 'react'
import { Link } from 'react-scroll'
const activeClass = ''

const TocMenuItem = ({ slug, raw, text, isActive, onSetActive, className }) => {
  return (
    <li className={className}>
      <Link
        activeClass={activeClass}
        className={`text-sm w-full text-blue-900 cursor-pointer inline-flex items-center py-2 leading-4 no-underline ${
          isActive && activeClass
        }`}
        to={slug}
        spy={true}
        smooth={true}
        offset={0}
        duration={500}
        delay={10}
        onSetActive={(to) => onSetActive(to, raw)}
      >
        {text.replace(/`/g, '')}
      </Link>
    </li>
  )
}

export default memo(TocMenuItem)
