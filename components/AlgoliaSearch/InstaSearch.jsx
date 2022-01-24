import { Configure, InstantSearch } from 'react-instantsearch-dom'

export default function InstaSearch({
  hitsPerPage = 10,
  searchClient,
  indexName,
  children
}) {
  return (
    <InstantSearch indexName={indexName} searchClient={searchClient}>
      <Configure hitsPerPage={hitsPerPage} />
      {children}
    </InstantSearch>
  )
}
