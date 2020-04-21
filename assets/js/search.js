var versionName = "docs"
let versionMatch = window.location.pathname.match(/v(.*)-docs\//) 
if (versionMatch && versionMatch[1]) { // check if we matched a version
  versionName = `v${versionMatch[1]}-docs`
}

docsearch({
  apiKey: 'e335fb22ca2fd2d96b4ba95b703430eb',
  indexName: 'cert-manager',
  inputSelector: '#search-box',
  algoliaOptions: {
    'facetFilters': [ `version:${versionName}` ]
  },
  debug: false // Set debug to true if you want to inspect the dropdown
});