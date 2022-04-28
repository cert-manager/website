<p align="center">
  <img src="https://raw.githubusercontent.com/cert-manager/cert-manager/d7a3a3976785bd5717d9d06b115878feaf257597/logo/logo.png" height="241" width="250" alt="cert-manager project logo" />
</p>

# cert-manager Website

Source code for the [cert-manager.io](https://cert-manager.io) website, which includes
documentation for each version of cert-manager as well as supported version information,
installation instructions, tutorials, guides, FAQs and information for contributors.

The site uses [next.js](https://nextjs.org/) as a framework, and all documentation is written
in [MDX](https://github.com/mdx-js/mdx) (Markdown).

## Development Requirements

At the very least, you'll need to install a couple of tools to be able to build and run
the site locally and to test your changes.

The following tool(s) must be installed on your system prior to developing the website:

* cURL
* NodeJS, version 16+
* Golang, version 1.17+

We also assume you've got GNU coreutils installed, which is usually the case by default on Linux
and should be installable via Homebrew on macOS.

## Website Development Guides

### Where's the documentation content?

First, docs go under `content/`; you shouldn't normally need to change files outside of `content/` when
making any documentation change.

There are several folders in `content/` and which one you need depends on what you're changing:

- Something which applies to the current version of cert-manager? <br />
  Add it to `docs/` and possibly to the specific version of cert-manager that's latest (e.g. `v1.8-docs/`)
- Something which only applies to the next major version of cert-manager? <br />
  Add it to `next-docs`
- Something which isn't "versioned", e.g. a page under "contributing", release notes or our supported-releases page? <br />
  Add it to `docs/`, which is the only place such pages should appear
- Something which applies only to versions of cert-manager which have already been released? <br />
  Change specific version docs (e.g. `v1.8-docs/`)

If you're not sure, _ask_! Reach out to us on [slack](https://cert-manager.io/docs/contributing/#slack) and
we'll point you in the right direction!

### Task: Linking to other documentation pages

When working on documentation, all links to other documentation pages should be _relative_ to the
document you're working on and should point at a named markdown file.

For example, take [this snapshot](https://raw.githubusercontent.com/cert-manager/website/d398905baef9841590fab6c2b854b74f0eecb006/content/docs/concepts/certificate.md)
of the "Certificate Concepts" page.

There's an external link to an RFC which is fully specified as expected:

> `see [RFC 5246 section 7.4.2](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.2)`

But towards the end of the page we link to the "Certificate Usage" page:

> `[here](../usage/certificate.md).`

If we're browsing the repository on the GitHub website (i.e. on [this page](https://github.com/cert-manager/website/blob/d398905baef9841590fab6c2b854b74f0eecb006/content/docs/concepts/certificate.md)), that relative link will work. In addition,
the next.js framework will ensure that the link is correct by stripping the `.md`, so the final rendered link
will be to `https://cert-manager.io/docs/usage/certificate` as we expect.

✨ When linking to an "Introduction" page, link to the README.md file directly. The framework will remove the whole
filename, so e.g. `[example link](../usage/README.md)` will link to `https://cert-manager.io/docs/usage/`.

### Task: Adding new pages

Documentation files aren't automatically picked up or added to the navigation on the site when created.

If you want a file to appear, you need to add it to the `manifest.json` file for the given version of the
site you're working on.

For example, the [manifest for the docs section](https://github.com/cert-manager/website/blob/master/content/docs/manifest.json)
contains the expected path for every file.

### Task: Changing OpenGraph / social sharing tags

These tags are defined in Next.js code and config.

For docs pages, OpenGraph titles and descriptions are based on the titles and descriptions in the docs themselves, which
is configured in the frontmatter for each docs page. The magic happens in in `pages/[...docs].jsx`.

For pages _except_ docs and for some other tags, look at changing [`next-seo.config.js`](./next-seo.config.js).

## Website Development Tooling

### Development Server

Running a development server with hot-reload functionality is a one-liner:

```bash
./scripts/server
```

This script will run `npm install` and then start a development server.

If you've already run `npm install`, you can manually run `npm run dev` as another option.

In any case, a server will spin up at `http://localhost:3000`.

Initial builds of a page on the development server can be quite slow - a few seconds - but
after the initial build changes should be picked up quickly and the development server
should be snappy to use.

### Running Verification Scripts

After you have made changes to the website, you should run the `verify` scripts
to ensure things like spelling and links are valid.

To run all verification checks:

```bash
./scripts/verify
```

This will automatically run a number of checks against your local environment.

If you want to be thorough, you can run `./scripts/verify-release` to also regenerate API / CLI docs
before verification, but that check is slower and unlikely to provide any useful insight.

### Building for a Release

On release, all output is placed into the `out/` directory.

Building a full release includes re-running API + CLI doc generation for the latest
version of cert-manager, and then running a next.js `build` followed by `export`. The full
release process can be run through one script:

```bash
./scripts/build-release
```

If you want to test that the build still works locally, you can run `./scripts/build` to build while
skipping regeneration of API / CLI docs.

### API / CLI Documentation Generation

To generate API / CLI reference docs manually, run:

```bash
./scripts/gendocs/generate
```

Since there are many old versions of cert-manager, none of which change regularly (or at all),
the website build process does not re-generate documentation for older versions, on the assumption
that doing so would be a waste of effort.

The solution for achieving this is simple; the generation scripts for older cert-manager versions
are commented out. To rebuild, uncomment them and then re-comment after.

For versions of cert-manager older than v1.8, API doc generation used the old cert-manager import
path and for this reason there's a different script - `scripts/gendocs/generate-old-import-path-docs`.
If you want to rebuild reference docs for versions older than 1.8, you'll also need to uncomment
`generate-old-import-path-docs` in `scripts/gendocs/generate`.

### Signing Keys

Public keys used for verifying signatures are served on the website statically, and are located
in `public/public-keys` directory.

See the [docs on signing keys](./content/docs/contributing/signing-keys.md) for more information
about how and why these keys are generated and provided here.
