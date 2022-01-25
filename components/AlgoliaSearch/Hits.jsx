import { useMemo } from 'react'
import { connectHits, Snippet } from 'react-instantsearch-dom'
import Link from 'next/link'
import AlgoliaLogo from 'components/snippets/AlgoliaLogo'

const Hits = connectHits(
  ({
    hits,
    showSearchResults = true,
    onClickResult,
    className,
    filterFunction = null
  }) => {
    const mappedHits = useMemo(
      () => (filterFunction ? hits.filter(filterFunction) : hits),
      [filterFunction, hits]
    )

    return (
      showSearchResults &&
      mappedHits.length > 0 && (
        <div className={`hits ${className}`}>
          <ul>
            {mappedHits.map((hit) => (
              <li key={hit.objectID} className="hits__item">
                <Link href={hit.path}>
                  <a
                    onClick={onClickResult}
                    className="flex flex-col py-2 pl-2 text-blue-700 transition ease-in-out duration-150 no-underline"
                  >
                    <Snippet
                      className="my-1 text-xl"
                      hit={hit}
                      attribute="title"
                      tagName="span"
                    />
                    <Snippet
                      hit={hit}
                      attribute="content"
                      tagName="strong"
                      nonHighlightedTagName="span"
                    />
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          <div className="h-12 px-3 flex justify-end items-center gap-3 text-sm">
            Search by <AlgoliaLogo className="h-6" />
          </div>
        </div>
      )
    )
  }
)

export default Hits
