import SidebarLink from './SidebarLink'
import Dropdown from './Dropdown'

export default function ListItems({ routes, setParentOpen }) {
  if (!routes) return null
  if (routes) {
    return routes.map((r, idx) => {
      if (!r.path) {
        return (
          <li key={`${r.title}-${idx}`}>
            <Dropdown routes={r} setParentOpen={setParentOpen} />
          </li>
        )
      } else {
        return (
          <li key={`${r.path}-${idx}`}>
            <SidebarLink
              href={r.path}
              caption={r.title}
              setParentOpen={setParentOpen}
            />
          </li>
        )
      }
    })
  } else {
    return <></>
  }
}
