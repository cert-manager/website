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

### Basic usage

Run from the repository root:

```bash
export GITHUB_TOKEN=$(gh auth token)
make generate-release-notes
```

`CERT_MANAGER_VERSION` defaults to `cert_manager_latest_version` from
`content/docs/variables.json`. Override it to target a specific version:

```bash
make generate-release-notes CERT_MANAGER_VERSION=v1.21.0
```

### Flags

-   `--release-version` : the release version (must be valid semver, leading `v` required).
-   `--release-notes-dir` : directory containing release-notes files (default: `.`).
-   `--end-rev` : override the upper bound ref for changelog collection.
    The tool auto-detects in order: release tag → release branch (`release-X.Y`) → `master`,
    so this flag is only needed in unusual cases.
-   `--start-rev` : override the lower bound ref (default: tag of the previous version).
-   `--github-org` / `--github-repo` (defaults: `cert-manager` / `cert-manager`).

### What the tool does

1.  Validates and canonicalizes `--release-version`.
2.  Ensures a release-notes file exists (creates from a template if missing).
3.  Migrates legacy files: if the file contains no tool markers, inserts community
    section markers (`contributors`, `maintainers`, `steerers`) using structural
    heuristics so subsequent passes can manage those sections.
4.  Uses `k8s.io/release/pkg/notes` to gather categorized notes and render Markdown.
5.  Updates the release-notes file:
    -   Inserts or replaces a versioned changelog section delimited by markers,
        replacing any pre-existing bare `## \`vX.Y.Z\`` heading on first run.
    -   Replaces pre-release sections for the same MAJOR.MINOR.PATCH when appropriate.
    -   Replaces the `contributors`, `maintainers`, and `steerers` sections.
6.  Writes updates atomically (writes to a `.new` temp file then renames it).

### Release-notes file markers

-   Unversioned (bootstrap) changelog:
    -   `{/* BEGIN changelog */}` and `{/* END changelog */}`
-   Versioned changelog:
    -   `{/* BEGIN changelog vX.Y.Z */}` … `{/* END changelog vX.Y.Z */}`
-   Community sections use the same pattern: `contributors`, `maintainers`, `steerers`.
-   Keep each marker on its own line with `LF` line endings.

### Semver / pre-release handling

When inserting a final release (e.g., `v1.2.3`), the tool replaces any earlier
pre-release section for the same MAJOR.MINOR.PATCH (e.g., `v1.2.3-beta.1`).

### Troubleshooting

-   **`invalid release version`** — ensure a leading `v`, e.g. `v1.19.0`.
-   **Changelog sections not detected** — verify markers are on separate lines with `LF` endings.
-   **GitHub API rate limits** — set `GITHUB_TOKEN` before running.

### Testing

```bash
cd scripts/release-notes
go test ./...
```

### Development notes

The tool uses `k8s.io/release/pkg/notes`. If you change changelog markers or
templates, update the regexes in `main.go` and add tests for edge cases (pre-release
replacement, legacy file migration).

For questions or bugs, open an issue in the
[cert-manager/website](https://github.com/cert-manager/website/issues) repository.
