# Release Notes Generator

> This tool generates and maintains cert-manager release notes. It gathers
> changelog entries via the `k8s.io/release` notes tooling, renders a changelog
> snippet, and updates a templated Markdown release-notes file.


### Quick overview

-   **Purpose:** generate and update the website release-notes page for cert-manager.
-   **Location:** `scripts/release-notes`.
-   **Language:** Go.

### Requirements

-   Go 1.25+.
-   Network access to GitHub. A token reduces API rate limits.
-   Optional: the `gh` CLI to obtain a token (`gh auth token`).

### Install / run locally

1.  Change to the tool directory.

```bash
cd scripts/release-notes
```

1.  Run one-off using `go run`:

```bash
go run . \
  --release-version v1.19.0 \
  --release-notes-dir ../content/docs/release \
```

1.  Build the binary:

```bash
go build -o release-notes .
./release-notes --help
```

### Basic usage

-   Required flags:
    -   `--release-version` : the release tag (must be a valid semver, leading `v` expected).
-   Useful flags:
    -   `--end-rev` (set to the release branch if the release version tag has not yet been created: `release-1.19`)
    -   `--release-notes-dir` (default: `.`)
    -   `--github-org` and `--github-repo` (defaults: `cert-manager` / `cert-manager`)

### What the tool does

1.  Validates and canonicalizes `--release-version`.
2.  Uses `k8s.io/release/pkg/notes` to gather categorized notes and render Markdown.
3.  Ensures a release-notes file exists (creates from a template if missing).
4.  Updates the release-notes file:
    -   Replaces the `maintainers`, `steerers`, and `contributors` sections.
    -   Inserts or replaces a versioned changelog section delimited by markers.
    -   Replaces prerelease sections for the same MAJOR.MINOR.PATCH when appropriate.
5.  Writes updates atomically (writes a `.new` temp file and renames it).

### Release-notes file markers / format

-   Unversioned (bootstrap) changelog:
    -   `{/* BEGIN changelog */}` and `{/* END changelog */}`
-   Versioned changelog:
    -   `{/* BEGIN changelog vX.Y.Z */}` &#x2026; `{/* END changelog vX.Y.Z */}`
-   Keep each marker on its own line and use `LF` line endings when possible.

### Semver / prerelease handling

-   When inserting a final release (e.g., `v1.2.3`), the tool will replace earlier prerelease sections (e.g., `v1.2.3-beta.1`) for the same MAJOR.MINOR.PATCH.

### Troubleshooting & tips

-   If you see `invalid release version` errors:
    -   Ensure you pass a leading `v`, e.g. `v1.19.0`.
-   If changelog sections are not detected:
    -   Verify markers are in the expected form and on separate lines.
    -   Normalize line endings to `LF`.
-   For GitHub API rate limits:
    -   Export `GITHUB_TOKEN` or use `export GITHUB_TOKEN=$(gh auth token)` before running.

### Testing

-   Run unit tests:

```bash
cd scripts/release-notes
go test ./...
```

### Contributing / development notes

-   The tool leverages `k8s.io/release/pkg/notes`. If you change changelog markers or templates, update regexes in `main.go` and add tests for edge cases (CRLF vs LF, prerelease replacement).

### License & contact

-   See the repository root for license information.
-   For questions or bugs, open an issue or contact the maintainer in the repo.
