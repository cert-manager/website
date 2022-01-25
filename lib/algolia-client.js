import algoliasearch from 'algoliasearch/lite'

export default class AlgoliaClient {
  constructor() {
    this.client = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_ID,
      process.env.NEXT_PUBLIC_ALGOLIA_KEY
    )
  }
  async search(requests) {
    if (requests.every(({ params: { query } }) => !query)) {
      return {
        results: requests.map(() => {
          return {
            processingTimeMS: 0,
            nbHits: 0,
            hits: [],
            facets: {}
          }
        })
      }
    }

    return this.client.search(requests)
  }
  async searchForFacetValues(requests) {
    return this.client.searchForFacetValues(requests)
  }
}
