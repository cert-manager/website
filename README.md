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

## Website Development

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
