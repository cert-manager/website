import { Configure, InstantSearch } from 'react-instantsearch-dom'
import { event } from 'lib/ga'

export default function InstaSearch({
  hitsPerPage = 10,
  searchClient,
  indexName,
  children
}) {
  return (
    <InstantSearch
      indexName={indexName}
      searchClient={searchClient}
      onSearchStateChange={(searchState) => {
        event({ action: 'search' }, { search_term: searchState.query })
      }}
    >
      <Configure hitsPerPage={hitsPerPage} />
      {children}
    </InstantSearch>
  )
}
