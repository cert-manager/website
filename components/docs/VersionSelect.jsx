export default function VersionSelect() {
  const versions = [
    {displayName: "v1.7", slug: "/docs"},
    {displayName: "v1.6", slug: "/v1.6-docs/index.html"},
    {displayName: "v1.5", slug: "/v1.5-docs/index.html"},
    {displayName: "v1.4", slug: "/v1.4-docs/index.html"},
    {displayName: "v1.3", slug: "/v1.3-docs/index.html"},
    {displayName: "v1.2", slug: "/v1.2-docs/index.html"},
    {displayName: "v1.1", slug: "/v1.1-docs/index.html"},
    {displayName: "v1.0", slug: "/v1.0-docs/index.html"},
    {displayName: "v0.16", slug: "/v0.16-docs/index.html"},
    {displayName: "v0.15", slug: "/v0.15-docs/index.html"},
    {displayName: "v0.14", slug: "/v0.14-docs/index.html"},
    {displayName: "v0.13", slug: "/v0.13-docs/index.html"},
    {displayName: "v0.12", slug: "/v0.12-docs/index.html"}
  ]

  const handleChange = (e) => {
    window.open(e.target.value)
  }

  return (
    <div className="flex items-center gap-2">
      <span>Documentation</span>
      <select onChange={(e) => handleChange(e)} className="w-18 p-1 border-gray-2/50 rounded-5px">
        {versions.map(version => (
          <option key={version.slug} value={version.slug}>{version.displayName}</option>
        ))}
      </select>
    </div>
  )
}
