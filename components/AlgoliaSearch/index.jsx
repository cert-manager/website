import Autocomplete from './AutoComplete'
import Hits from './Hits'
import { Configure, InstantSearch } from 'react-instantsearch-dom'
import { event } from 'lib/ga'

export default function AlgoliaSearch({
  onAutoCompleteFocus = () => {},
  filterHits,
  hitsPerPage = 10,
  searchClient,
  indexName,
  showSearchResults,
  onClickResult,
  hitsClassName,
  formClassName,
  inputClassName,
  handleSubmit,
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
      <Autocomplete
        onFocus={onAutoCompleteFocus}
        handleSubmit={handleSubmit}
        formClassName={formClassName}
        inputClassName={inputClassName}
      />
      <Hits
        showSearchResults={showSearchResults}
        onClickResult={onClickResult}
        className={hitsClassName}
        filterFunction={filterHits}
      />
      {children}
    </InstantSearch>
  )
}

export { Autocomplete, Hits }
