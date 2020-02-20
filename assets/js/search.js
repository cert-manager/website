var client = algoliasearch('18N9PEKHUC', '29ab24453d2b70065a76b4e1a6a82abc');
var indexName = "cert-manager-latest"
let versionMatch = window.location.href.match(/v(.*)-docs\//) 
if (versionMatch && versionMatch[1]) { // check if we matched a version
  indexName = `cert-manager-v${versionMatch[1]}`
}
var index = client.initIndex(indexName);

autocomplete('#search-box', { hint: false }, [
  {
    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
    attributesToSnippet: [
      "content:10"
    ],
    displayKey: 'title',
    clearOnSelected: true,
    templates: {
      empty: "Nothing found",
      suggestion: function(suggestion) {
        console.log(suggestion._snippetResult)
        return `
        <div>
          <a href="${suggestion.uri.replace("en","")}">${suggestion._highlightResult.title.value}</a>
        </div>
        <div class="search-snippet">
          ${suggestion._snippetResult.content.value}
        </div>`;
      },
      footer: '<div class="algolia-branding"><a href="https://algolia.com"><img src="/images/search-by-algolia-light-background.svg" alt="Search powered by Algolia" /></a></div>',
    }
  }
]).on('autocomplete:selected', function(event, suggestion, dataset, context) {
    window.location.assign(suggestion.uri.replace("en",""));
});