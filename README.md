# cert-manager website

This repository contains the source code for the [cert-manager.io](https://cert-manager.io)
website, as well as the project documentation.

## Developing

We provide a number of scripts that can be used to build and develop the site.

### Branches

The 'master' branch should be targeted for the majority of PRs.

This repo has 'release branches' (i.e. `release-0.12`, `release-0.13`, ...).
These are kept in-line with the release branches in the
[`jetstack/cert-manager`](https://github.com/jetstack/cert-manager) repository.

Once your pull request has been merged into master, it is typically
'cherrypicked' into whatever release branches it is appropriate to make the
change in.

If a change **only** affects a specific older version, pull requests can be
opened directly against the documentation content in the `contents/docs`
directory.

Changes to other areas of the codebase on release branches are not permitted.

The HTML/CSS/JavaScript used for the final website will always be deployed
from the latest 'release branch' - this means that all versions of our
documentation have a consistent style, and avoids us having to run the
`hugo` command from multiple different release branches.

### Multi-versioning

Because we publish documentation for multiple versions of cert-manager, we have
an additional 'release' mode that can be used when building, developing or
deploying the website.

The majority of scripts mentioned below have corresponding `*-release` versions
that can be used. These scripts will first gather all content from all the
configured documentation versions and include them in the output.

This is **not** enabled by default as it requires running `git clone` multiple
times against multiple copies of the repository, which is a time consuming
operation.

### Requirements

The majority of tools needed to build the website are automatically installed
and versioned when you build the site by the tools in `scripts/`.

You also need to ensure you have the following tool(s) installed on your system
as they are not managed by the `scripts/` directory:

* npm/nodejs
* Golang 1.12+

### Local development

When developing locally, you can use the `hugo server` mode to start a local
webserver that watches for changes on your filesystem and automatically
refreshes the generated content and page when changes are detected.

To run this mode, run:

```
./scripts/server
```

This will start a local webserver on `http://localhost:1313` where you can view
the built site.

There is also a `./scripts/server-release` command which will fetch all
versions of the documentation content before running the regular `server`
script.

### Building output HTML

If you want to build a directory containing the built HTML, you can run the
following command:

```
./scripts/build
```

This will generate a directory named `public/` that can be easily served by the
default configuration of most webservers.

There is also a `./scripts/build-release` command which will fetch all
versions of the documentation content before running the regular `build`
script.

### Running verification scripts

After you have made changes to the website, you should run the `verify` scripts
to ensure things like spelling and links are valid.

To run all the verify checks, run:

```
./scripts/verify
```

This will automatically run a number of checks against your changes.

If `./scripts/verify` fails with a number of `..target not found..` errors, you
can run  `./scripts/verify-release` instead, which will fetch all versions of the
documentation content before running the regular `verify` script.
