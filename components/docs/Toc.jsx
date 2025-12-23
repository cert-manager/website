/*
  Toc renders the table-of-contents based on the headings found in the current document (excluding the title heading)
  It is displayed in the right-hand column when the display is >= 1280.

  This component uses the following Tailwind CSS classes dynamically, so
  we include the names here so that they can be extracted:

  pl-0 pl-1 pl-2 pl-3 pl-4 pl-5 pl-6 pl-7 pl-8 pl-9 pl-10

  See https://tailwindcss.com/docs/content-configuration#dynamic-class-names

  @maxHeadingLevel: Headings at higher levels than this will be hidden from the TOC

  @indentation: Each item will be indented by this much relative to the lowest heading level found in the TOC content.
*/

export default function Toc({ contents, maxHeadingLevel, indentation=2 }) {
  const items = contents.filter((item) => item.depth <= maxHeadingLevel)
  const minLevel = Math.min(...items.map((item) => item.depth))

  return (
    items.length > 0 && (
        <nav className="sticky top-4">
          <h4 className="text-xs uppercase font-bold mb-2">
            On this page
          </h4>
          <ul>
            {items.map((item, idx) => {
                return (
                    <li className={`pl-${(item.depth - minLevel) * indentation} mb-2`} key={idx}>
                      <a
                        className="text-sm cursor-pointer no-underline"
                        href={`#${item.slug}`}
                        title={item.text}
                      >
                        {item.text}
                      </a>
                    </li>
                )
            })}
          </ul>
        </nav>
    )
  )
}
