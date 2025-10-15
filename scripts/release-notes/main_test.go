package main

import (
	"strings"
	"testing"

	"github.com/blang/semver/v4"
	"github.com/stretchr/testify/assert"
	"k8s.io/apimachinery/pkg/util/sets"
)

func TestUpdateChangelogSection(t *testing.T) {

	type testCase struct {
		name           string
		in             string
		releaseVersion string
		newChangelog   string
		out            string
		err            string
	}

	testCases := []testCase{
		{
			// If there is no existing changelog section, do not add one.
			name: "no existing changelog section",
			in: dedent(`
			  # Release Notes
			  Some initial content.
			  `),
			releaseVersion: "1.2.3",
			newChangelog:   "- Added new feature X\n- Fixed bug Y",
			out: dedent(`
			  # Release Notes
			  Some initial content.
			  `),
		},
		{
			// If there is an existing unversioned changelog section, update it to be versioned.
			// This handles the case where the changelog section has just been boot strapped
			// and is not yet versioned.
			// This should only happen once, when the changelog section is first added.
			name: "existing unversioned changelog section",
			in: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog */}
			  {/* END changelog */}
			  More content here.
			  `),
			releaseVersion: "1.2.3",
			newChangelog:   "- Added new feature X\n- Fixed bug Y",
			out: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog v1.2.3 */}
			  - Added new feature X
			  - Fixed bug Y
			  {/* END changelog v1.2.3 */}
			  More content here.
			  `),
		},
		{
			// If there is an existing versioned changelog section, but the
			// version in the BEGIN and END delimiter does not match, return an
			// error.
			// This handles the case where the changelog section has been manually edited
			// or there is a bug in the code that updates the changelog section.
			// In either case, we do not want to silently overwrite the existing changelog section.
			// The user will need to manually fix the changelog section before running the release again.
			name: "mismatched versioned changelog sections",
			in: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog v1.2.2 */}
			  - Previous changelog entry for v1.2.2
			  {/* END changelog v1.2.1 */}
			  More content here.
			  `),
			releaseVersion: "1.2.3",
			newChangelog:   "- Added new feature X\n- Fixed bug Y",
			err:            "mismatched changelog section: 1.2.2 != 1.2.1",
		},
		{
			// If there are existing versioned changelog sections, add the new
			// changelog section at the top.
			// This handles the case where there are multiple releases and we want to
			// keep the changelog sections in order.
			// The most recent release should be at the top.
			// This should be the most common case.
			name: "existing versioned changelog sections",
			in: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog v1.2.2 */}
			  - Previous changelog entry for v1.2.2
			  {/* END changelog v1.2.2 */}
			  {/* BEGIN changelog v1.2.1 */}
			  - Previous changelog entry for v1.2.1
			  {/* END changelog v1.2.1 */}
			  More content here.
			  `),
			releaseVersion: "1.2.3",
			newChangelog:   "- Added new feature X\n- Fixed bug Y",
			out: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog v1.2.3 */}
			  - Added new feature X
			  - Fixed bug Y
			  {/* END changelog v1.2.3 */}
			  {/* BEGIN changelog v1.2.2 */}
			  - Previous changelog entry for v1.2.2
			  {/* END changelog v1.2.2 */}
			  {/* BEGIN changelog v1.2.1 */}
			  - Previous changelog entry for v1.2.1
			  {/* END changelog v1.2.1 */}
			  More content here.
			  `),
		},
		{
			// If there is an existing versioned changelog section that matches
			// the release version, update it with the new changelog content.
			// This handles the case where the previous release was a pre-release
			// E.g. v1.2.3-alpha.0 then v1.2.3-beta.0 and finally v1.2.3.
			// In this case, we want to update the existing changelog section
			name: "update existing versioned changelog section",
			in: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog v1.2.3 */}
			  - Old changelog entry for v1.2.3
			  {/* END changelog v1.2.3 */}
			  More content here.
			  `),
			releaseVersion: "1.2.3",
			newChangelog:   "- Updated changelog entry for v1.2.3",
			out: dedent(`
			  # Release Notes
			  Some initial content.
			  {/* BEGIN changelog v1.2.3 */}
			  - Updated changelog entry for v1.2.3
			  {/* END changelog v1.2.3 */}
			  More content here.
			  `),
		},
	}
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			got, err := updateChangelogSection([]byte(tc.in), semver.MustParse(tc.releaseVersion), tc.newChangelog)
			if tc.err != "" {
				assert.Nil(t, got)
				assert.EqualError(t, err, tc.err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tc.out, string(got))
		})
	}
}

// dedent removes common leading whitespace from each line in s and trims leading/trailing empty lines.
// What does "common leading whitespace" mean?
// It means that if all non-empty lines start with the same number of spaces or tabs, those are removed.
// For example, if all non-empty lines start with two spaces, those two spaces are removed from each line.
// If lines have different leading whitespace, no dedenting is done.
func dedent(s string) string {
	lines := strings.Split(s, "\n")

	// Find the minimum indentation
	minIndent := -1
	for _, line := range lines {
		trimmed := strings.TrimLeft(line, " \t")
		if trimmed == "" {
			continue // skip empty lines
		}
		indent := len(line) - len(trimmed)
		if minIndent == -1 || indent < minIndent {
			minIndent = indent
		}
	}

	if minIndent > 0 {
		for i, line := range lines {
			if len(line) >= minIndent {
				lines[i] = line[minIndent:]
			}
		}
	}

	// Trim leading and trailing empty lines
	start, end := 0, len(lines)
	for start < end && strings.TrimSpace(lines[start]) == "" {
		start++
	}
	for end > start && strings.TrimSpace(lines[end-1]) == "" {
		end--
	}

	return strings.Join(lines[start:end], "\n") + "\n"
}

func TestDedent(t *testing.T) {
	type testCase struct {
		name string
		in   string
		out  string
	}

	testCases := []testCase{
		{
			name: "simple dedent",
			in: dedent(`
			  line one
			  line two
			  line three
			  `),
			out: "line one\nline two\nline three\n",
		},
		{
			name: "leading/trailing empty lines",
			in: dedent(`

			  line one
			  line two

			  line three

			  `),
			out: "line one\nline two\n\nline three\n",
		},
		{
			name: "only empty lines",
			in:   dedent(``),
			out:  "\n",
		},
		{
			name: "no dedent needed",
			in: dedent(`line one
line two
line three`),
			out: "line one\nline two\nline three\n",
		},
	}
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			got := dedent(tc.in)
			assert.Equal(t, tc.out, got)
		})
	}
}

func TestExtractContributors(t *testing.T) {
	type testCase struct {
		name string
		in   string
		out  sets.Set[string]
	}

	testCases := []testCase{
		{
			name: "simple contributors",
			in: dedent(`
			  {/* BEGIN changelog v1.2.3 */}
			  ## [1.2.3] - 2024-06-01
			  - Some change (#123) [` + "`@alice`" + `]
			  - Another change (#124) [` + "`@bob`" + `]
			  {/* END changelog v1.2.3 */}

			  {/* BEGIN changelog v1.2.2 */}
			  ## [Unreleased]
			  - Some change (#123) [` + "`@alice`" + `]
			  - Another change (#124) [` + "`@carol`" + `]
			  {/* END changelog v1.2.2 */}
			  `),
			out: sets.New[string]("alice", "bob", "carol"),
		},
	}
	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			allChangelog := extractAllChangelog([]byte(tc.in))
			got := extractContributors(allChangelog)
			assert.Equal(t, tc.out, got)
		})
	}
}
