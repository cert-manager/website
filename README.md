<p align="center">
  <img src="https://raw.githubusercontent.com/cert-manager/cert-manager/d53c0b9270f8cd90d908460d69502694e1838f5f/logo/logo-small.png" height="256" width="256" alt="cert-manager project logo" />
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

### Which branch should I use?

There are two relevant branches used for website development: `master` and `release-next`.

Changes to `master` will be reflected on the live website shortly after they're merged. If your change is relevant
to any version of cert-manager which has already been released, your change likely needs to be made against master.

`release-next` is used for features which haven't been released in a stable version of cert-manager yet. Changes
will be reflected on a preview deployment for the release-next branch which is linked to from the main site.

### Where's the documentation content?

First, docs go under `content/`; you shouldn't normally need to change files outside of `content/` when
making any documentation change.

There are several folders in `content/` and which one you need depends on what you're changing:

- Something which applies to the current version of cert-manager? <br />
  Add it to `docs/` and possibly to the specific version of cert-manager that's latest (e.g. `v1.8-docs/`)
- Something which only applies to the next major version of cert-manager? <br />
  Add it to `docs/` but branch from the [`release-next` branch](https://github.com/cert-manager/website/tree/release-next) and merge the PR into that branch. See above.
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

If you're adding a top-level page which should only appear in the `docs/` section (such as the existing "contributing" section)
then add `"x-only-docs": true` underneath the title in `manifest.json`. This will cause that section to be removed when a new versioned docs section.

Likewise, if a folder shouldn't be copied from `docs/` to a versioned section, add a file called `.x-only-docs` to that folder, and it will be removed from any newly created versioned documentation.

### Task: Changing OpenGraph / social sharing tags

These tags are defined in Next.js code and config.

For docs pages, OpenGraph titles and descriptions are based on the titles and descriptions in the docs themselves, which
is configured in the frontmatter for each docs page. The magic happens in in `pages/[...docs].jsx`.

For pages _except_ docs and for some other tags, look at changing [`next-seo.config.js`](./next-seo.config.js).

### Task: Adding a Comment in Documentation

Sometimes you'll want to add a comment which is only for documentation maintainers.

Use `{/* my comment */}` rather than the HTML-style comments you'd normally use for Markdown files. Other comment types will cause errors.

### Task: Merging `master` into `release-next`

In rare occasions, when writing documentation for an unreleased feature, you may
notice that some recent changes in `master` aren't present in `release-next`. If
that is a problem, you will want to update `release-next` branch with the latest
changes from `master`. To update `release-next` with the changes made to
`master`, follow these steps:

1. Create a PR to merge `master` into `release-next` using [this magic
   link][ff-release-next].
2. If you see the label `dco-signoff: no`, add a comment on the PR with:

   ```text
    /override dco
    ```

   It is necessary because some the merge commits have been written by the bot
   and do not have a DCO signoff.

[ff-release-next]: https://github.com/cert-manager/website/compare/release-next...master?quick_pull=1&title=%5Brelease-next%5D+Merge+master+into+release-next&body=%3C%21--%0A%0AThe+command+%22%2Foverride+dco%22+is+necessary+because+some+the+merge+commits%0Ahave+been+written+by+the+bot+and+do+not+have+a+DCO+signoff.%0A%0A--%3E%0A%0A%2Foverride+dco

## Website Development Tooling

First [install nodejs (and package manager called `npm`)](https://nodejs.org/en/).
Then install all the tools and packages required to build the website as follows:

```bash
npm ci
```

This command is similar to `npm install` but it ensures that you will have a clean install of all the dependencies.

### Development Server

The best development environment uses the Netlify CLI to serve the site locally. The Netlify CLI server
closely matches the environment in which the website is deployed, and will enable local debugging of redirects and
environment variables.

To run this server, install the [Netlify CLI](https://docs.netlify.com/cli/get-started/) as follows:

```bash
npm install -g netlify-cli
```

Then run the server:

```bash
./scripts/server
```

Note that the server will also be accessible locally at port 3000, but that on this port there'll be no
support for debugging redirects or environment variables. Use port 8888.

Initial builds of a page on the development server can be quite slow - a few seconds - but
after the initial build changes should be picked up quickly and the development server
should be snappy to use.

### Running Verification Scripts

After you have made changes to the website, you should run the `verify` script
to ensure things like spelling are valid.
To run all verification checks:

```bash
./scripts/verify
```

This will automatically run a number of checks against your local environment, including:

* Lint checks on the nextjs code using [next lint](https://nextjs.org/docs/basic-features/eslint).
* Link checks on all pages using [markdown-link-check](https://github.com/tcort/markdown-link-check).
* Spelling in all pages using [mdspell](https://github.com/lukeapage/node-markdown-spellcheck).
* Formatting of the markdown in all pages using [remark](https://github.com/remarkjs/remark).

> ℹ️ All these checks are also run automatically for pull requests.
> The results will be reported in the [checks summary](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks) at the bottom of your GitHub PR.
> Read the [cert-manager-website-presubmits.yaml prow configuration file](https://github.com/cert-manager/testing/blob/master/config/jobs/cert-manager/website/cert-manager-website-presubmits.yaml) and the [check.yaml workflow file](.github/workflows/check.yaml) for more details.

### Building for a Release

On release, all output is placed into the `out/` directory.
The full release process can be run through one script:

```bash
./scripts/build-release
```

### API / CLI Documentation Generation

To update the [API documentation](https://cert-manager.io/docs/reference/api-docs/) and [CLI documentation](https://cert-manager.io/docs/cli/), run:

```bash
./scripts/gendocs/generate
```

This should be done before every cert-manager release (if the API or CLI flags have changed)
and any time the API or CLI of the [satellite projects](https://cert-manager.io/docs/contributing/projects/) changes,
and the changes should be committed.

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
