package main

// This tool generates release notes for cert-manager using the k8s.io/release/pkg/notes package.
// It creates or updates a Markdown file with a structured template, including sections for
// major themes, contributors, maintainers, steering committee, and a changelog.
// The changelog section is updated to include changes since the previous version.
// Usage example:
//   go run main.go -release-version v1.19.0 -previous-version v1.18.2 -release-notes-dir ./docs/release -verbose

import (
	"bytes"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"

	"github.com/blang/semver/v4"
	"k8s.io/apimachinery/pkg/util/sets"
	"k8s.io/release/pkg/notes"
	"k8s.io/release/pkg/notes/document"
	notesoptions "k8s.io/release/pkg/notes/options"
)

// maintainers is a set of GitHub handles of cert-manager maintainers.
var maintainers = sets.New[string]("inteon", "erikgb", "SgtCoDFish", "ThatsMrTalbot", "munnerz", "maelvls", "wallrj", "wallrj-cyberark", "hjoshi123")

// steeringCommittee is a set of GitHub handles of cert-manager steering committee members.
var steeringCommittee = sets.New[string]("FlorianLiebhart", "ssyno", "ianarsenault", "TrilokGeer")

// releaseNotesTemplate is the template used to create a new cert-manager release notes file.
// It is used with the text/template package.
var releaseNotesTemplate = `
---
title: Release {{ .Version.Major }}.{{ .Version.Minor }}
description: 'cert-manager release notes: cert-manager {{ .Version.Major }}.{{ .Version.Minor }}'
---

cert-manager is the easiest way to automatically manage certificates in
Kubernetes and OpenShift clusters.

{/* BEGIN summary */}
TODO
{/* END summary */}

Be sure to review all new features and changes below, and read the full release notes carefully before upgrading.

## Major Themes

{/* BEGIN themes */}
TODO
{/* END themes */}

## Community

As always, we'd like to thank all of the community members who helped in this release cycle, including all below who merged a PR and anyone that helped by commenting on issues, testing, or getting involved in cert-manager meetings. We're lucky to have you involved.

A special thanks to:

{/* BEGIN contributors */}
TODO
{/* END contributors */}

...for their contributions, comments and support!

Also, thanks to the cert-manager maintainer team for their help in this release:

{/* BEGIN maintainers */}
TODO
{/* END maintainers */}

And finally, thanks to the cert-manager steering committee for their feedback in this release cycle:

{/* BEGIN steerers */}
TODO
{/* END steerers */}

{/* BEGIN changelog */}
TODO
{/* END changelog */}
`

// changelogTemplate is the template used to render the changelog section for a specific version.
// It is used with the k8s.io/release/pkg/notes/document.RenderMarkdownTemplate function.
var changelogTemplate = `
## ` + "`" + `{{ .CurrentRevision }}` + "`" + `

Changes since ` + "`" + `{{ .PreviousRevision }}` + "`" + `:
{{ range .Notes }}
### {{.Kind | prettyKind}}

{{range $note := .NoteEntries }}{{println "-" $note}}{{end}}
{{- end -}}
`

// config holds the configuration for the release notes generation.
type config struct {
	releaseVersionFlag string
	releaseVersion     semver.Version
	previousVersion    semver.Version
	releaseNotesDir    string
	notes              *notesoptions.Options
}

// newConfig creates a new config with default values.
func newConfig() config {
	k8sReleaseNotesConfig := notesoptions.New()
	k8sReleaseNotesConfig.AddMarkdownLinks = true
	k8sReleaseNotesConfig.Pull = true
	k8sReleaseNotesConfig.ListReleaseNotesV2 = true
	return config{
		notes: k8sReleaseNotesConfig,
	}
}

// Bind binds the config to the command line flags.
func (o *config) Bind(fs *flag.FlagSet) {
	fs.StringVar(&o.releaseVersionFlag, "release-version", "", "The version for which to generate release notes (e.g. v1.19.0)")
	fs.StringVar(&o.releaseNotesDir, "release-notes-dir", ".", "The directory where release notes files are stored")
	fs.StringVar(&o.notes.GithubOrg, "github-org", "cert-manager", "The GitHub organization where the cert-manager repository is located")
	fs.StringVar(&o.notes.GithubRepo, "github-repo", "cert-manager", "The GitHub repository name for cert-manager")
	fs.StringVar(&o.notes.StartRev, "start-rev", "", "The first revision to include in the release notes")
	fs.StringVar(&o.notes.EndRev, "end-rev", "", "The last revision to include in the release notes")
}

// ValidateAndFinalize validates the config and computes derived values.
func (o *config) ValidateAndFinalize() error {
	if o.releaseVersionFlag == "" {
		return fmt.Errorf("release-version is required")
	}

	if releaseVersion, err := semver.ParseTolerant(o.releaseVersionFlag); err == nil {
		o.releaseVersion = releaseVersion
	} else {
		return fmt.Errorf("Invalid release version: %s", err)
	}

	if o.notes.EndRev == "" {
		o.notes.EndRev = o.autoDetectEndRev()
	}

	if previousVersion, err := computePreviousVersion(o.releaseVersion); err == nil {
		o.previousVersion = previousVersion
	} else {
		return fmt.Errorf("failed to compute previous version: %s", err)
	}

	if o.notes.StartRev == "" {
		o.notes.StartRev = "v" + o.previousVersion.String()
	}

	if err := o.notes.ValidateAndFinish(); err != nil {
		return fmt.Errorf("invalid notes options: %s", err)
	}
	return nil
}

// autoDetectEndRev determines the best end revision for changelog collection.
// It tries the release tag first, then the release branch (release-X.Y), then
// falls back to master. This allows the tool to run before the tag is created.
func (o *config) autoDetectEndRev() string {
	tag := "v" + o.releaseVersion.String()
	releaseBranch := fmt.Sprintf("release-%d.%d", o.releaseVersion.Major, o.releaseVersion.Minor)
	for _, candidate := range []string{tag, releaseBranch, "master"} {
		if githubRefExists(o.notes.GithubOrg, o.notes.GithubRepo, candidate) {
			log.Printf("Auto-detected end revision: %s", candidate)
			return candidate
		}
		log.Printf("End revision candidate not found: %s", candidate)
	}
	return "master"
}

// githubRefExists reports whether a git ref (tag name or branch name) exists
// in the given GitHub repository. Uses GITHUB_TOKEN for authentication if set.
func githubRefExists(org, repo, ref string) bool {
	// Tags start with "v"; everything else is treated as a branch.
	var apiRef string
	if strings.HasPrefix(ref, "v") {
		apiRef = "tags/" + ref
	} else {
		apiRef = "heads/" + ref
	}
	url := fmt.Sprintf("https://api.github.com/repos/%s/%s/git/ref/%s", org, repo, apiRef)
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return false
	}
	if token := os.Getenv("GITHUB_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return false
	}
	resp.Body.Close()
	return resp.StatusCode == http.StatusOK
}

func main() {
	cfg := newConfig()
	cfg.Bind(flag.CommandLine)
	flag.Parse()

	if err := cfg.ValidateAndFinalize(); err != nil {
		log.Fatalf("invalid configuration: %v", err)
	}

	finalOutputPath, err := ensureReleaseNotesFile(cfg.releaseNotesDir, cfg.releaseVersion)
	if err != nil {
		log.Fatalf("failed to ensure release notes file: %v", err)
	}

	finalContent, err := os.ReadFile(finalOutputPath)
	if err != nil {
		log.Fatalf("failed to read output file: %v", err)
	}

	// Migrate legacy files that were created before the tool added markers.
	finalContent = insertMissingMarkers(finalContent)

	// Skip the expensive release-notes lookup if the release version is already present
	// in the changelog section.
	if bytes.Contains(finalContent, []byte(fmt.Sprintf("{/* BEGIN changelog v%s */}", cfg.releaseVersion))) {
		log.Printf("release version %s already present in changelog, skipping release notes generation", cfg.releaseVersion)
	} else {
		releaseNotes, err := notes.GatherReleaseNotes(cfg.notes)
		if err != nil {
			log.Fatalf("failed to gather release notes: %v", err)
		}

		releaseNotesDocument, err := document.New(releaseNotes, "v"+cfg.previousVersion.String(), "v"+cfg.releaseVersion.String())
		if err != nil {
			log.Fatalf("failed to create release notes document: %v", err)
		}

		changelogContent, err := releaseNotesDocument.RenderMarkdownTemplate("", "", "", "go-template:inline:"+changelogTemplate)
		if err != nil {
			log.Fatalf("failed to render changelog: %v", err)
		}

		changelogContent = quotePRsAndHandles(changelogContent)

		// The changelog section grows as patch versions are released.
		// Each new patch version is added above the previous ones.
		// The changelog is ordered from newest to oldest.
		// A special case is pre-release changelogs which are replaced with
		// subsequent pre-releases and then finally replaced with the X.Y.0 release.
		finalContent, err = updateChangelogSection(finalContent, cfg.releaseVersion, changelogContent)
		if err != nil {
			log.Fatalf("failed to update changelog section: %v", err)
		}
	}

	// Extract all changelog sections to find contributors
	allChangelog := extractAllChangelog(finalContent)
	nonMaintainerContributors := extractContributors(allChangelog).Difference(maintainers)
	finalContent = replaceSection(finalContent, "contributors", buildGithubUserList(nonMaintainerContributors))

	finalContent = replaceSection(finalContent, "maintainers", buildGithubUserList(maintainers))
	finalContent = replaceSection(finalContent, "steerers", buildGithubUserList(steeringCommittee))

	// Write to a temp file and rename to avoid partial writes
	// in case of errors.
	tmpPath := finalOutputPath + ".new"
	if err := os.WriteFile(tmpPath, finalContent, 0644); err != nil {
		log.Fatalf("failed to write output file: %v", err)
	}
	if err := os.Rename(tmpPath, finalOutputPath); err != nil {
		log.Fatalf("failed to rename output file: %v", err)
	}
}

// extractAllChangelog extracts all the `{/* BEGIN changelog vX.Y.Z */}{/* END
// changelog vX.Y.Z */}` sections and returns the concatenated content as a
// string.
func extractAllChangelog(content []byte) []byte {
	matches := reVersioned.FindAllSubmatchIndex(content, -1)
	var buf bytes.Buffer
	for _, match := range matches {
		if len(match) != 8 {
			log.Fatalf("failed to parse changelog section in release notes")
		}
		sectionContent := bytes.TrimSpace(content[match[4]:match[5]])
		buf.Write(sectionContent)
		buf.WriteString("\n")
	}
	return buf.Bytes()
}

// extractContributors extracts unique GitHub handles from the changelog content.
// Handles are expected to be in the format [@handle] or [`@handle`].
func extractContributors(changelog []byte) sets.Set[string] {

	matches := reContributors.FindAllSubmatch(changelog, -1)
	contributorSet := sets.New[string]()
	for _, match := range matches {
		if len(match) > 1 {
			contributorSet.Insert(string(match[1]))
		}
	}
	return contributorSet
}

// reUnversioned matches the unversioned changelog section.
// The BEGIN and END delimiters must be on their own lines.
var reUnversioned = regexp.MustCompile(`(?s){/\* BEGIN changelog \*/}\n(.*?){/\* END changelog \*/}\n`)

// reVersioned matches versioned changelog sections.
// The BEGIN and END delimiters must be on their own lines.
var reVersioned = regexp.MustCompile(`(?s){/\* BEGIN changelog v(\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?) \*/}\s*(.*?)\s*{/\* END changelog v(\d+\.\d+\.\d+(?:-[0-9A-Za-z-.]+)?) \*/}\n`)

var reContributors = regexp.MustCompile(`\[` + "`?" + `@([a-zA-Z0-9_-]+)` + "`?" + `\]`)
var rePR = regexp.MustCompile(`\[#([0-9]+)\]`)
var reHandle = regexp.MustCompile(`\[@([a-zA-Z0-9_-]+)\]`)
var reTopHeading = regexp.MustCompile(`(?m)^## `)

// changelogBlock formats a versioned changelog block.
func changelogBlock(ver, body string) string {
	return fmt.Sprintf("{/* BEGIN changelog v%s */}\n%s\n{/* END changelog v%s */}\n",
		ver, strings.TrimSpace(body), ver)
}

// updateChangelogSection updates the changelog sections in the release notes content.
// There may be multiple changelog sections containing multiple versions, ordered from newest to oldest.
// The supplied changelog is inserted in reverse semantic order among the existing changelog content,
// replacing any existing entry for the same version.
// The newest version is first.
// If an entry for the same version already exists, it is replaced.
// If an entry for an earlier pre-release of the same version exists, it is replaced.
// Each changelog section is delimited by {/* BEGIN changelog X.Y.Z */} and {/* END changelog X.Y.Z */}.
// The initial release notes file contain one special unversioned changelog section, delimited by
// {/* BEGIN changelog */} and {/* END changelog */}, which is replaced by the first versioned section.
//
// If no changelog sections exist, the content is returned unchanged.
func updateChangelogSection(content []byte, releaseVersion semver.Version, newChangelog string) ([]byte, error) {
	// Handle the unversioned changelog section first
	// This is only present in the initial release notes file.
	// It is replaced by the first versioned changelog section.
	// Subsequent releases will not have this unversioned section.
	if reUnversioned.Match(content) {
		return reUnversioned.ReplaceAll(content, []byte(changelogBlock(releaseVersion.String(), newChangelog))), nil
	}

	// Find all versioned changelog sections (non-greedy match)
	//
	// matches is a slice of slices of indices:
	// Each inner slice contains the start and end indices of the full match,
	// followed by pairs of start and end indices for each capturing group.
	// For our regex with 3 capturing groups, each inner slice has 8 elements:
	// [fullStart, fullEnd, group1Start, group1End, group2Start, group2End, group3Start, group3End]
	// where group1 is the version after BEGIN, group2 is the content, and group3 is the version after END.
	matches := reVersioned.FindAllSubmatchIndex(content, -1)

	type section struct {
		Version semver.Version
		Content []byte
	}
	var sections []section
	for _, match := range matches {
		if len(match) != 8 {
			log.Fatalf("failed to parse changelog section in release notes")
		}
		versionOpen := string(content[match[2]:match[3]])
		versionClose := string(content[match[6]:match[7]])
		if versionOpen != versionClose {
			return nil, fmt.Errorf("mismatched changelog section: %s != %s", versionOpen, versionClose)
		}
		sectionVersion, err := semver.Parse(versionOpen)
		if err != nil {
			return nil, fmt.Errorf("invalid semver in changelog section: %s: %s", versionOpen, err)
		}
		sectionContent := bytes.TrimSpace(content[match[4]:match[5]])
		sections = append(sections, section{
			Version: sectionVersion,
			Content: sectionContent,
		})
	}

	if len(matches) == 0 {
		// No versioned changelog sections exist.
		// Look for a legacy ## `vX.Y.Z` heading for this version and replace
		// that entire section with the generated content wrapped in markers.
		// This handles files that were created manually before the tool existed.
		versionHeading := "## `v" + releaseVersion.String() + "`"
		reVersionHeading := regexp.MustCompile(`(?m)^` + regexp.QuoteMeta(versionHeading) + ` *$`)
		loc := reVersionHeading.FindIndex(content)
		if loc == nil {
			return content, nil
		}
		// Find end of this section: next top-level ## heading, or EOF.
		rest := content[loc[1]:]
		nextLoc := reTopHeading.FindIndex(rest)
		var buf bytes.Buffer
		buf.Write(content[:loc[0]])
		buf.WriteString(changelogBlock(releaseVersion.String(), newChangelog))
		if nextLoc != nil {
			buf.Write(rest[nextLoc[0]:])
		}
		return buf.Bytes(), nil
	}

	// If we reach here, there are existing versioned changelog sections.
	lastIndex := matches[len(matches)-1][1]
	var buf bytes.Buffer

	// Write content before the first changelog section (if any)
	buf.Write(content[:matches[0][0]])

	// Insert the new changelog section in the correct order
	inserted := false
	for _, sec := range sections {
		if !inserted {
			switch {
			case sec.Version.FinalizeVersion() == releaseVersion.FinalizeVersion():
				// Same major.minor.patch version, replace existing section
				buf.WriteString(changelogBlock(releaseVersion.String(), newChangelog))
				inserted = true
				continue // skip writing the old section
			case releaseVersion.GT(sec.Version):
				// New version is greater, insert before this section
				buf.WriteString(changelogBlock(releaseVersion.String(), newChangelog))
				inserted = true
			}
		}
		buf.WriteString(changelogBlock(sec.Version.String(), string(sec.Content)))
	}

	// If not yet inserted, append at the end
	if !inserted {
		buf.WriteString(changelogBlock(releaseVersion.String(), newChangelog))
	}

	// Write any content after the last changelog section (if any)
	if lastIndex < len(content) {
		buf.Write(content[lastIndex:])
	}

	return buf.Bytes(), nil
}

// insertMissingMarkers is called when a release-notes file exists but contains
// no tool-managed markers. It uses structural heuristics to locate the known
// sections (contributor list, maintainer list, steering-committee list, and
// per-version changelog headings) and wraps each one with the markers that
// subsequent passes expect to find. Existing content is never replaced —
// the markers are inserted around it so that the tool can take over on the
// next run.
//
// The function is a no-op when the file already contains at least one marker.
func insertMissingMarkers(content []byte) []byte {
	if bytes.Contains(content, []byte("{/* BEGIN ")) {
		return content
	}

	orig := string(content)
	s := orig

	// Community-section markers (anchors match the cert-manager release-notes template).
	// Changelog markers are intentionally not inserted here: updateChangelogSection
	// handles the first-run case by replacing any existing ## `vX.Y.Z` heading with
	// freshly generated content inside markers. That way the skip-if-present check
	// does not fire until the tool has actually generated the section.
	s = insertSimpleMarker(s,
		"A special thanks to:\n\n",
		"\n\nfor their contributions",
		"contributors")
	s = insertSimpleMarker(s,
		"cert-manager maintainer team for their help in this release:\n\n",
		"\n\nAnd finally",
		"maintainers")
	s = insertMarkerUntilNextHeading(s,
		"cert-manager steering committee for their feedback in this release cycle:\n\n",
		"steerers")

	if s != orig {
		log.Printf("Inserted missing markers into legacy release-notes file")
	}
	return []byte(s)
}

// insertSimpleMarker wraps the text between `after` and `before` with
// {/* BEGIN name */} / {/* END name */} markers, leaving that text intact.
func insertSimpleMarker(s, after, before, name string) string {
	afterIdx := strings.Index(s, after)
	if afterIdx < 0 {
		return s
	}
	contentStart := afterIdx + len(after)
	beforeIdx := strings.Index(s[contentStart:], before)
	if beforeIdx < 0 {
		return s
	}
	contentEnd := contentStart + beforeIdx
	existing := strings.TrimRight(s[contentStart:contentEnd], "\n")
	wrapped := fmt.Sprintf("{/* BEGIN %s */}\n%s\n{/* END %s */}", name, existing, name)
	return s[:contentStart] + wrapped + s[contentEnd:]
}

// insertMarkerUntilNextHeading wraps the text that follows `after` up to the
// next top-level `## ` heading (or EOF) with {/* BEGIN name */} / {/* END name */}.
// Any blank lines that separate the wrapped content from the next heading are
// preserved as a separator after the closing marker.
func insertMarkerUntilNextHeading(s, after, name string) string {
	afterIdx := strings.Index(s, after)
	if afterIdx < 0 {
		return s
	}
	contentStart := afterIdx + len(after)
	rest := s[contentStart:]
	loc := reTopHeading.FindStringIndex(rest)
	if loc != nil {
		contentEnd := contentStart + loc[0]
		existing := strings.TrimRight(s[contentStart:contentEnd], "\n")
		// Preserve the blank lines that separated the content from the next heading.
		separator := s[contentStart+len(existing) : contentEnd]
		return s[:contentStart] +
			fmt.Sprintf("{/* BEGIN %s */}\n%s\n{/* END %s */}", name, existing, name) +
			separator +
			s[contentEnd:]
	}
	existing := strings.TrimRight(s[contentStart:], "\n")
	return s[:contentStart] +
		fmt.Sprintf("{/* BEGIN %s */}\n%s\n{/* END %s */}\n", name, existing, name)
}


// ensureReleaseNotesFile creates the release notes file if it does not exist
func ensureReleaseNotesFile(releaseNotesDir string, version semver.Version) (string, error) {
	path := filepath.Join(releaseNotesDir, fmt.Sprintf("release-notes-%d.%d.md", version.Major, version.Minor))
	if _, err := os.Stat(path); err == nil {
		// file exists
		return path, nil
	} else if !os.IsNotExist(err) {
		// some other error (permission, IO)
		return "", fmt.Errorf("stat failed: %w", err)
	}

	tpl, err := template.New("release-notes").Parse(releaseNotesTemplate)
	if err != nil {
		return "", fmt.Errorf("template parse error: %w", err)
	}
	var buf bytes.Buffer
	if err := tpl.Execute(&buf, struct{ Version semver.Version }{
		Version: version,
	}); err != nil {
		return "", fmt.Errorf("template execution error: %w", err)
	}
	tmpPath := path + ".new"
	if err := os.WriteFile(tmpPath, buf.Bytes(), 0644); err != nil {
		return "", fmt.Errorf("failed to write new file: %w", err)
	}
	if err := os.Rename(tmpPath, path); err != nil {
		return "", fmt.Errorf("failed to rename new file: %w", err)
	}
	return path, nil
}

// buildGithubUserList returns a Markdown list of GitHub users.
func buildGithubUserList(users sets.Set[string]) string {
	var b strings.Builder
	for _, user := range sets.List(users) {
		b.WriteString(fmt.Sprintf("- [`@%s`](https://github.com/%s)\n", user, user))
	}
	return b.String()
}

// replaceSection replaces the content between {/* BEGIN name */} and {/* END name */} with newContent
func replaceSection(content []byte, name, newContent string) []byte {
	re := regexp.MustCompile(fmt.Sprintf(`(?s){/\* BEGIN %s \*/}(.*?){/\* END %s \*/}`, name, name))
	// ensure single trailing newline around newContent
	ncontent := strings.TrimRight(newContent, "\n") + "\n"
	return re.ReplaceAll(content, []byte(fmt.Sprintf("{/* BEGIN %s */}\n%s{/* END %s */}", name, ncontent, name)))
}

// quotePRsAndHandles quotes PR numbers and GitHub handles for spell checker compatibility
func quotePRsAndHandles(s string) string {
	s = rePR.ReplaceAllString(s, "[`#$1`]")
	return reHandle.ReplaceAllString(s, "[`@$1`]")
}

// computePreviousVersion computes the previous semantic version.
// If the patch version is greater than 0, it decrements the patch version.
// If the patch version is 0 and the minor version is greater than 0, it decrements the minor version and sets the patch version to 0.
// If both the patch and minor versions are 0 and the major version is greater than 0, it decrements the major version and sets both the minor and patch versions to 0.
// If the version is 0.0.0, it returns an error.
// E.g. v1.19.0 -> v1.18.0, v1.19.2 -> v1.19.1, v1.0.0 -> error
func computePreviousVersion(v semver.Version) (semver.Version, error) {
	prev := v
	prev.Build = nil
	prev.Pre = nil
	switch {
	case v.Patch > 0:
		prev.Patch -= 1
	case v.Patch == 0 && v.Minor > 0:
		prev.Minor -= 1
	case v.Patch == 0 && v.Minor == 0 && v.Major > 0:
		prev.Major -= 1
	default:
		return prev, fmt.Errorf("cannot determine previous version for %s", v)
	}
	return prev, nil
}
