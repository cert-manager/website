module.exports = {
  output: 'export',

  reactStrictMode: true,
  // By default, Next.js doesn't create index.html files in directories.
  // Instead, it creates an HTML file named after the directory, which also
  // works fine in browsers.
  //
  //   docs/
  //   ├── getting-started.html
  //   └── getting-started/
  //
  // We want to keep the old behavior, that originates from when we used Hugo.
  // Relying on index.html makes it a bit easier to use tools such as htmltest.
  // With the option "trailingSlash: true", we get the following layout:
  //
  //   docs/
  //   └── getting-started/
  //      └── index.html
  //
  // More documentation can be found here:
  // https://nextjs.org/docs/upgrading#next-export-no-longer-exports-pages-as-indexhtml
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    unoptimized: true
  }
}
