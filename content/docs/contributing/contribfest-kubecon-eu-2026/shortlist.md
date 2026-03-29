---
title: ContribFest Good First Issues — KubeCon EU 2026
description: 'Curated beginner-friendly issues for the cert-manager ContribFest session'
---

Curated shortlist for the cert-manager ContribFest session, Amsterdam, 24 March 2026.

Source data: `issues.json` (339 open issues across 12 cert-manager repos, fetched 2026-03-21).
Note: `thumbsUp` counts are 0 for `cert-manager/cert-manager` (GitHub GraphQL was timing out; that field was omitted from that repo's fetch).

**GitHub Project**: [cert-manager / ContribFest KubeCon EU 2026](https://github.com/orgs/cert-manager/projects/10) — all shortlisted issues loaded with Category and Difficulty fields.

---

## No Go Required (documentation, Helm, YAML)

These are suitable for contributors who are new to the codebase or not comfortable with Go.

| Repo | Issue | Title | Notes |
|------|-------|-------|-------|
| cert-manager/cert-manager | [#8363](https://github.com/cert-manager/cert-manager/issues/8363) | helm: Set `ttlSecondsAfterFinished` on Jobs | **PR open: [#8523](https://github.com/cert-manager/cert-manager/pull/8523)** by `dap0am` — no human review yet. A ContribFest attendee could review it rather than re-implement. |
| cert-manager/website | [#944](https://github.com/cert-manager/website/issues/944) | Document installing cert-manager in a different namespace | Docs-only. High demand (3 thumbs up). |
| cert-manager/website | [#1806](https://github.com/cert-manager/website/issues/1806) | Broken tutorial: kuard image no longer available | Docs fix. 4 thumbs up. |
| cert-manager/website | [#1715](https://github.com/cert-manager/website/issues/1715) | Document the `secret-template` annotation | Docs-only. |
| cert-manager/website | [#228](https://github.com/cert-manager/website/issues/228) | EAB doc correction | Docs-only. |
| cert-manager/website | [#197](https://github.com/cert-manager/website/issues/197) | Document ACME account mismatch error | Docs-only. |

---

## Go — Well Scoped

These require Go but are self-contained with a clear fix path.

| Repo | Issue | Title | Difficulty | Notes |
|------|-------|-------|-----------|-------|
| cert-manager/cert-manager | [#8642](https://github.com/cert-manager/cert-manager/issues/8642) | cainjector: fix misleading log message when ignoring a secret | Easy | One-line fix in `pkg/controller/cainjector/sources.go`. Log references `ownerReference` but the actual check is the `cert-manager.io/certificate-name` annotation. Found via TODO comment. |
| cert-manager/cert-manager | [#8643](https://github.com/cert-manager/cert-manager/issues/8643) | ACME scheduler: allow parallel challenges with different ingress classes or DNS providers | Medium | Extend `compareChallenges` in `pkg/controller/acmechallenges/scheduler/scheduler.go` to compare solver attributes. Found via TODO comments. |
| cert-manager/cert-manager | [#8644](https://github.com/cert-manager/cert-manager/issues/8644) | CertificateRequest approval webhook: cache negative API discovery results | Medium | Extend existing cache in `internal/webhook/admission/certificaterequest/approval/` to also store "not found" results, avoiding repeated API server queries. Found via TODO comment. |
| cert-manager/cert-manager | [#8434](https://github.com/cert-manager/cert-manager/issues/8434) | Allow EAB with ECC keys | Medium | **Two PRs open:** [#8585](https://github.com/cert-manager/cert-manager/pull/8585) by `Onyx2406` (no reviews yet); [#8457](https://github.com/cert-manager/cert-manager/pull/8457) by `marie-j` (changes requested by `hjoshi123`). Good opportunity to review or help unblock. |
| approver-policy | [#713](https://github.com/cert-manager/approver-policy/issues/713) | Remove deprecated metrics | Easy | Delete 3 `prometheus.NewDesc` vars, 3 collect functions, 3 `Collect()` calls, update tests. All in `pkg/internal/metrics/metrics.go`. |
| csi-driver-spiffe | [#128](https://github.com/cert-manager/csi-driver-spiffe/issues/128) | Incorrect logger initialization | Easy | Replace `klog.TODO()` with `klog.Background()` in `internal/flags/flags.go:71`. One-line fix. |
| cmctl | [#128](https://github.com/cert-manager/cmctl/issues/128) | User-agent reports `v0.0.0` | Easy | Add `rest.AddUserAgent` call in `pkg/factory/factory.go` after REST config is built. ~3 lines. |
| cmctl | [#264](https://github.com/cert-manager/cmctl/issues/264) | Commands show error instead of help when called without arguments | Easy-Medium | Add help output to ~6 cobra commands that require arguments. Mechanical but touches multiple files. |
| csi-driver | [#256](https://github.com/cert-manager/csi-driver/issues/256) | Broken comma-separated split logic for URI SANs | Medium | Replace naive `splitList` with `encoding/csv` for URI parsing in `pkg/requestgen/generator.go`. Needs a test case. |
| cert-manager/cert-manager | [#8645](https://github.com/cert-manager/cert-manager/issues/8645) | Venafi: remove dead `RenewCertificate` method from connector interface | Easy | Delete the method from the interface, the instrumented wrapper, and the fake — three files, no behavior change. Found via TODO comment. |
| cmctl | [#442](https://github.com/cert-manager/cmctl/issues/442) | inspect secret: response body not closed on error path during CRL check | Easy | Add `defer resp.Body.Close()` after successful `http.Do()`; remove the existing explicit close. `bodyclose` linter misses this because it sees Close() on the happy path; see [`golang/go#75902`](https://github.com/golang/go/issues/75902). |

---

## Stretch Goals

Larger scope — suitable for experienced contributors or as a take-home.

| Repo | Issue | Title | Notes |
|------|-------|-------|-------|
| approver-policy | [#782](https://github.com/cert-manager/approver-policy/issues/782) | startupapicheck for approver-policy | Multi-step feature: Helm chart + new Go binary + CI. Well-specified by Ashley. |
| trust-manager | [#837](https://github.com/cert-manager/trust-manager/issues/837) | startupapicheck for trust-manager | Same pattern as `approver-policy#782`. |
| csi-driver | [#130](https://github.com/cert-manager/csi-driver/issues/130) | JKS keystore support | Port PKCS12 keystore support to JKS format. |
| csi-driver | [#17](https://github.com/cert-manager/csi-driver/issues/17) | Support pod IP in volume attributes | Allow `$POD_IP` expansion via downward API. 6 thumbs up. |

---

## Excluded

| Repo | Issue | Reason |
|------|-------|--------|
| cert-manager/cert-manager | [#8493](https://github.com/cert-manager/cert-manager/issues/8493) | Labelled `good first issue` but is an environment-specific networking timeout with no clear fix path. |
| cert-manager/website | [#320](https://github.com/cert-manager/website/issues/320) | GitOps docs — 4 thumbs up but scope is unclear. |
