import Link from 'next/link'
import VersionSelect from 'components/docs/VersionSelect'

function ListItems({ routes }) {
  if (routes) {
    return routes.map((r) => {
      if (!r.path) {
        return (
          <li key={r.title}>
            <h4 className="text-gray-500 uppercase font-bold">{r.title}</h4>
            <ul>
              <ListItems routes={r.routes} />
            </ul>
          </li>
        )
      } else {
        return (
          <li key={r.title}>
            <Link key={r.path} href={r.path}>
              <a className="flex py-2 pl-2 text-sm font-medium text-gray-600 transition ease-in-out duration-150">
                {r.title}
              </a>
            </Link>
          </li>
        )
      }
    })
  } else {
    return <></>
  }
}

export default function Sidebar({ routes, versions }) {
  return (
    <div className="flex-none ">
      <div className="sticky top-4  overflow-y-auto">
        <div className="">
          <aside className="">
            <div className="mb-8">
              <VersionSelect versions={versions} />
            </div>
            <nav className="flex-1 px-2 space-y-1 mt-6">
              {routes &&
                Object.keys(routes).map((route, idx) => {
                  const obj = routes[route]
                  return (
                    <div key={`sidebar-${idx}`}>
                      <h3 className="text-gray-800 uppercase font-bold">
                        {obj.title}
                      </h3>
                      <ul>
                        <ListItems routes={obj.routes} />
                      </ul>
                    </div>
                  )
                })}
            </nav>
          </aside>
        </div>
      </div>
    </div>
  )
}
