import { findResultsState } from 'react-instantsearch-dom/server'
import algoliasearch from 'algoliasearch/lite'

const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX

// Keys are supplied from Algolio's instant search example
// https://github.com/algolia/react-instantsearch
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_KEY
)

export { findResultsState, indexName, searchClient }
