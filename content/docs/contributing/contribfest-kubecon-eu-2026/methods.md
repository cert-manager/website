---
title: Methods - Good First Issue Shortlist
description: 'How to reproduce and refine the ContribFest issue shortlist'
---

How to reproduce and refine the issue shortlist in `shortlist.md`.

---

## Prerequisites

- `gh` CLI, authenticated: `gh auth status`
- `jq`: `/usr/bin/jq`

---

## Step 1: Discover active repos

List all public cert-manager repos, then manually exclude archived, inactive, or
non-code repos (e.g. `community`, `website` may warrant separate treatment):

```bash
gh repo list cert-manager --limit 100 --json name,isArchived,updatedAt \
  --jq '.[] | select(.isArchived == false) | [.updatedAt, .name] | @tsv' | sort -r
```

The repos included in the 2026-03-21 fetch were:

```
cert-manager/approver-policy
cert-manager/aws-privateca-issuer
cert-manager/cert-manager        # main repo — fetched separately (see note below)
cert-manager/cmctl
cert-manager/csi-driver
cert-manager/csi-driver-spiffe
cert-manager/google-cas-issuer
cert-manager/issuer-lib
cert-manager/istio-csr
cert-manager/openshift-routes
cert-manager/trust-manager
cert-manager/website
```

---

## Step 2: Fetch issues

### Satellite repos (supports reactionGroups for thumbs-up counts)

```bash
REPOS="approver-policy aws-privateca-issuer cmctl csi-driver csi-driver-spiffe google-cas-issuer issuer-lib istio-csr openshift-routes trust-manager website"

for repo in $REPOS; do
  gh issue list \
    --repo cert-manager/$repo \
    --state open \
    --limit 200 \
    --json number,title,updatedAt,comments,assignees,reactionGroups,url,labels \
    --jq "[.[] | {
      repo: \"cert-manager/$repo\",
      number: .number,
      title: .title,
      url: .url,
      updatedAt: .updatedAt,
      thumbsUp: ((.reactionGroups[] | select(.content == \"THUMBS_UP\") | .users.totalCount) // 0),
      comments: .comments,
      assigned: (.assignees | length > 0),
      goodFirstIssue: (.labels | map(.name) | contains([\"good first issue\"])),
      labels: (.labels | map(.name))
    }]"
done > /tmp/issues-raw.json

/usr/bin/jq -s 'add' /tmp/issues-raw.json > issues-satellite.json
```

### Main cert-manager/cert-manager repo

The `reactionGroups` field causes GraphQL timeouts on this large repo.
Fetch without it (thumbsUp will be 0):

```bash
gh issue list \
  --repo cert-manager/cert-manager \
  --state open \
  --limit 200 \
  --json number,title,updatedAt,comments,assignees,url,labels \
  --jq '[.[] | {
    repo: "cert-manager/cert-manager",
    number: .number,
    title: .title,
    url: .url,
    updatedAt: .updatedAt,
    thumbsUp: 0,
    comments: (.comments | length),
    assigned: (.assignees | length > 0),
    goodFirstIssue: (.labels | map(.name) | contains(["good first issue"])),
    labels: (.labels | map(.name))
  }]' > issues-main.json
```

### Merge

```bash
/usr/bin/jq -s '.[0] + .[1]' issues-satellite.json issues-main.json > issues.json
/usr/bin/jq length issues.json   # sanity check total count
```

---

## Step 3: Explore the data

### All good-first-issue labelled issues, sorted by thumbs-up

```bash
/usr/bin/jq -r '
  ["REPO", "#", "TITLE", "👍", "💬", "ASSIGNED"],
  (
    .[]
    | select(.goodFirstIssue == true)
    | [.repo, .number, .title[:55], .thumbsUp, .comments, (if .assigned then "yes" else "" end)]
  )
  | @tsv
' issues.json | column -t -s $'\t'
```

### All issues with any thumbs-up, not yet assigned

```bash
/usr/bin/jq -r '
  ["REPO", "#", "TITLE", "👍", "💬", "GFI"],
  (
    .[]
    | select(.thumbsUp > 0 and .assigned == false)
    | [.repo, .number, .title[:55], .thumbsUp, .comments, (if .goodFirstIssue then "★" else "" end)]
  )
  | @tsv
' issues.json | sort -t $'\t' -k4 -rn | column -t -s $'\t'
```

### Issues by repo

```bash
/usr/bin/jq -r '[.[].repo] | group_by(.) | map({repo: .[0], count: length}) | .[] | [.repo, .count] | @tsv' \
  issues.json | column -t -s $'\t'
```

### Filter to a specific repo

```bash
/usr/bin/jq -r '.[] | select(.repo == "cert-manager/cert-manager") | [.number, .title[:60]] | @tsv' \
  issues.json | column -t -s $'\t'
```

---

## Step `3b`: Search for TODO/FIXME/XXX comments in source code

GitHub issues don't capture everything. Searching source code for TODO comments can surface
well-scoped, forgotten tasks that are good first issues but have never been filed.

```bash
# Search all Go source (excluding tests and vendor) across all checked-out repos
rg "// (TODO|FIXME|XXX)[:\s]" \
  --type go \
  --glob "!*_test.go" \
  --glob "!*/test/*" \
  --glob "!*/vendor/*" \
  /home/richard/projects/github.com/cert-manager/
```

Assess each result by reading the surrounding context (10–20 lines) and asking:
- Is the fix described clearly enough to attempt without deep domain knowledge?
- Is the change contained within one or two files?
- Would completing it meaningfully improve the project?

TODOs that describe **design decisions**, **migration risks**, or **future features** are
generally not suitable. TODOs that describe a **specific missing check**, **wrong log message**,
or **obvious extension point** often are.

If a good TODO has no corresponding GitHub issue, file one (with `good first issue` +
`help wanted` labels) so it appears in future issue searches and can be tracked.

---

## Step `3c`: AI-assisted code review

As a final sweep, we used [Claude Code](https://claude.ai/code) (Anthropic's AI coding
assistant) to review the source code of all active cert-manager repos directly. With the
repos checked out locally, Claude was asked to search for common Go code quality patterns
that are easy to fix but hard to discover through issue searches alone:

- Leaked `http.Response` bodies (missing `defer resp.Body.Close()`)
- Deprecated API usage hidden behind `//nolint` suppressions
- Dead code in interfaces flagged by TODO comments
- Error variable naming convention violations (`errname` linter bypasses)
- Unchecked error returns and misused `context.Background()` / `context.TODO()`

For each candidate, the surrounding code was read to confirm the fix was real, bounded,
and not already covered by an open issue or PR. Candidates that passed that check were
drafted as GitHub issues and filed with `good first issue` + `help wanted` labels.

This approach surfaced two issues that would not have been found by the GitHub issue
search or the TODO grep alone:

- [`cert-manager#8645`](https://github.com/cert-manager/cert-manager/issues/8645) — dead `RenewCertificate` method in the Venafi connector interface
- [`cmctl#442`](https://github.com/cert-manager/cmctl/issues/442) — response body leak on error path in the CRL revocation check

Note on the `cmctl` issue: the `bodyclose` linter was already enabled in `.golangci.yaml`
but did not flag it, because its flow analysis considers a body "handled" if `Close()` is
called anywhere in the function — even if that call is unreachable on some paths. This is
a known gap; a proposal to fix the upstream analyzer is tracked at
[`golang/go#75902`](https://github.com/golang/go/issues/75902).

---

## Step 4: Curating the shortlist

After generating the data queries above, each candidate issue was reviewed manually:

1. Read the issue body via `gh issue view <number> --repo <repo>`
2. Read the relevant source code to verify the fix is actually well-scoped
3. Assessed on three axes:
   - **Scope**: Can a new contributor complete it in ~1 hour with guidance?
   - **Clarity**: Is the problem and expected fix clearly described?
   - **Reward**: Does fixing it meaningfully improve the project?

Issues were grouped into:
- **No Go required** — docs, Helm, YAML changes only
- **Go — well scoped** — self-contained Go changes with a clear fix path
- **Stretch goals** — larger features suitable as take-home work
- **Excluded** — issues that are misleadingly labelled or lack a clear fix path

---

## Step 5: Check for existing PRs

Before finalizing the shortlist, check each candidate issue for linked pull requests.
An issue with an open PR needs a different call to action ("review this PR" rather than
"fix this issue"). An issue with a merged PR may already be resolved and should be dropped.

```bash
# Search for PRs that close a given issue (adjust repo and number as needed)
gh pr list \
  --repo cert-manager/cert-manager \
  --search "closes:#8363 OR fixes:#8363" \
  --state all \
  --json number,title,state,mergedAt \
  --jq '.[] | [.state, .number, .title] | @tsv'
```

Note: this search can return false positives (e.g. automated dependency bumps whose
PR descriptions happen to include a matching issue number). Filter results by title —
dependency bumps from Renovate/Dependabot are always labelled "Bump the all group..."
or similar.

For each real match, check the PR's review state:

```bash
gh pr view <number> --repo cert-manager/<repo> \
  --json title,state,reviewDecision,reviews,author \
  --jq '{title, state, author: .author.login, reviewDecision,
         reviews: (.reviews | map({author: .author.login, state: .state}))}'
```

Annotate the shortlist accordingly:
- **Merged PR** → drop the issue from the shortlist (already fixed)
- **Open PR, no reviews** → note it; attendees can review rather than re-implement
- **Open PR, changes requested** → note it; attendees can help address feedback
- **Closed PR (not merged)** → treat the issue as still open

---

## Step 6: Create a GitHub Project

Once the shortlist is finalized, load all issues into a GitHub Project so maintainers
can track status and attendees (once the project is made public) can browse by difficulty.

```bash
# Create the project under the org
gh project create --owner cert-manager --title "ContribFest KubeCon EU 2026" --format json

# Add each shortlisted issue (repeat for all issues)
gh project item-add <project-number> --owner cert-manager \
  --url https://github.com/cert-manager/cert-manager/issues/8642

# List items to get their node IDs (needed for field edits)
gh project item-list <project-number> --owner cert-manager --format json \
  --jq '.items[] | {id: .id, title: .title, url: .content.url}'

# Create single-select fields
gh project field-create <project-number> --owner cert-manager \
  --name "Category" --data-type "SINGLE_SELECT" \
  --single-select-options "No Go Required,Go — Well Scoped,Stretch Goal" --format json

gh project field-create <project-number> --owner cert-manager \
  --name "Difficulty" --data-type "SINGLE_SELECT" \
  --single-select-options "Easy,Easy-Medium,Medium,Hard" --format json

# Set fields on each item (use node IDs and option IDs from the create output)
gh project item-edit --id <item-node-id> --project-id <project-node-id> \
  --field-id <field-node-id> --single-select-option-id <option-id>

# When ready to share publicly:
gh project edit <project-number> --owner cert-manager --visibility PUBLIC
```

The project for KubeCon EU 2026 is at: https://github.com/orgs/cert-manager/projects/10

---

## Refreshing the data

To update `issues.json` before a future event, re-run Steps 1–2, then repeat
Steps 3–5 to re-evaluate the shortlist. Pay particular attention to:
- Issues that have been closed since the last fetch
- New `good first issue` labels added by maintainers
- PRs that were open at the last refresh but have since merged or stalled

```bash
# Quick state check for all shortlisted issues at once
for repo_issue in \
  "cert-manager/cert-manager 8363" \
  "cert-manager/cert-manager 8434" \
  "cert-manager/cert-manager 8642" \
  "cert-manager/cert-manager 8643" \
  "cert-manager/cert-manager 8644" \
  "cert-manager/cert-manager 8645" \
  "cert-manager/approver-policy 713" \
  "cert-manager/cmctl 128" \
  "cert-manager/cmctl 264" \
  "cert-manager/cmctl 442" \
  "cert-manager/csi-driver 256" \
  "cert-manager/csi-driver-spiffe 128"; do
  repo=$(echo $repo_issue | cut -d' ' -f1)
  number=$(echo $repo_issue | cut -d' ' -f2)
  state=$(gh issue view $number --repo $repo --json state --jq '.state')
  echo "$state  $repo #$number"
done
```
