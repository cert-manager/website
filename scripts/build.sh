#!/bin/bash

# Quit on error
set -e

# Set default branch (latest docs release)
DEFAULTBRANCH="master"
BRANCH="$DEFAULTBRANCH"

# Get and use specified branch name otherwise, use default (latest release)
# Check if branch was manually specified (ie. force a branch to run specific test builds -> not to knative.dev)
# (Example [in netlify.toml]: command = "./scripts/build.sh -b specifiedbranchname")
while getopts b: branch
do
echo '------ MANUAL BUILD REQUESTED ------'
# Set specified branch
BRANCH="${OPTARG}"
done

# If a webhook requested the build, find and use that branch name
# Check for webhook payload
if [[ $INCOMING_HOOK_BODY || $INCOMING_HOOK_TITLE || $INCOMING_HOOK_URL ]]
then
# First look for "merged" content
MERGEDPR=$(echo "$INCOMING_HOOK_BODY" | grep -o '\"merged\"\:true\,' || true)
# If a merged PR if found, then deploy production site (www.knative.dev)
if [[ $MERGEDPR ]]
then
echo '------ PR' "$PULL_REQUEST" 'MERGED ------'
echo 'Running production build...'
else
echo '------ BUILD REQUEST FROM WEBHOOK ------'
echo 'Webhook Title:' "$INCOMING_HOOK_TITLE"
echo 'Webhook URL:' "$INCOMING_HOOK_URL"
echo 'Webhook Body:' "$INCOMING_HOOK_BODY"
# Getting branch from webhook
echo 'Parsing Webhook request for branch name'
# Check if webhook request came from an PR
PULLREQUEST=$(echo "$INCOMING_HOOK_BODY" | grep -o -m 1 '\"pull_request\"' || true)
if [[ $PULLREQUEST ]]
then
# Webhook from a PR
GETPRBRANCH=$(echo "$INCOMING_HOOK_BODY" | grep -o -m 1 '\"head\"\:{\"label\":.*\"ref\"\:\".*\"\,\"sha' || true)
BRANCH1=$(echo "$GETPRBRANCH" | sed -e 's/\"\,\"sha\"\:.*//;s/.*\"ref\"\:\"//')
else
# Webhook from a 'git push'
GETRELEASEBRANCH=$(echo "$INCOMING_HOOK_BODY" | grep -o ':"refs\/heads\/.*\"\,\"before\":' || true)
BRANCH=$(echo "$GETRELEASEBRANCH" | sed -e 's/:\"refs\/heads\///;s/\"\,\"before\"://')
fi
fi
else
echo 'Running default branch build'
fi

echo '------ BUILD DETAILS ------'
echo 'Build type:' "$CONTEXT"
echo 'Building docs from branch:' "$BRANCH"
echo 'Commit HEAD:' "$HEAD"
echo 'Commit SHA:' "$COMMIT_REF"
# Other Netlify flags that aren't currently useful
#echo 'Repo:' "$REPOSITORY_URL"
# Doesnt seem to like multiple repos and always returns false
#echo 'Pull Request:' "$PULL_REQUEST"
#echo 'GitHub ID:' "$REVIEW_ID"

echo '------ PROCESSING SOURCE FILES ------'
# Pull in content from the separate community source and docs source repos
# (make it look like they live in the content folder of knative/website )
# Use a temp directory and move files around to prevent git clone error (fails if directory exists)
# Note: This forces a complete build of all versions of all files in the site

# Make sure nothings there from the last build and start from scratch
rm -rf content/en

# Get latest source from:
# - https://github.com/knative/docs
# - https://github.com/knative/community
echo 'Cloning cert-manager documentation from their source repositories.'
# MASTER
echo 'Getting blog posts and contributor samples from knative/docs master branch'
git clone -b master https://github.com/cert-manager/docs.git content/en
echo 'Getting pre-release development docs from master branch'
# Move "pre-release" docs content into the 'development' folder:
mv content/en/docs content/en/development

# COMMUNITY
# echo 'Getting Knative contributor guidelines from knative/community'
# git clone -b master https://github.com/knative/community.git temp/communtiy
# # Move files into existing "contributing" folder (includes site's '_index.md' section definition)
# echo 'Move content into contributing folder'
# mv temp/communtiy/* content/en/contributing

# DOCS BRANCHES
# Get versions of released docs from their branches in knative/docs
echo 'Begin fetching all version of the docs...'
echo 'Getting the latest release from ' "$BRANCH" ' branch'
git clone -b "$BRANCH" https://github.com/cert-manager/docs.git temp/release/latest

###############################################################
# Template for next release:
#git clone -b "release-[VERSION#]" https://github.com/knative/docs.git temp/release/[VERSION#]
#mv temp/release/[VERSION#]/docs content/en/[VERSION#]-docs
###############################################################

# Only copy and keep the "docs" folder from all branched releases:
mv temp/release/latest/docs content/en/docs
echo 'Getting the archived docs releases'
echo 'Moving cloned files into their v#.#-docs website folders'
# CLEANUP
# Delete temporary directory
# (clear out unused files, including archived-copies/past-versions of blog posts and contributor samples)
echo 'Cleaning up temp directory'
rm -rf temp

# MAKE RELATIVE LINKS WORK
# We want users to be able view and use the source files in GitHub as well as on the site.
# Therefore, the following changes need to be made to all docs files prior to Hugo site build.
# Convert GitHub enabled source, into HUGO supported content:
#  - For all 'content/*.md' files:
#    - Skip/assume any Markdown link with fully qualified HTTP(s) URL is 'external'
#    - Otherwise, remove all '.md' file extensions from Markdown links
#    - Replace all "README.md" with "index.html"
#  - For files NOT included using the "readfile" shortcode:
#     (exclude all README.md files from relative link adjustment)
#    - Adjust relative links by adding additional depth:
#      - Convert './' to '../'
#      - Convert '../' to '../../'
#  - Ignore Hugo site related files:
#     - _index.md files (req. Hugo 'section' files)
#     - API shell files (until those API source builds are modified to include frontmatter)
#  - Skip GitHub files:
#    - .git* files
#    - non-docs directories
echo 'Converting all GitHub links in source files for Hugo build...'
find . -type f -path '*/content/*.md' ! -name '*_index.md' ! -name '*README.md' ! -name '*serving-api.md' ! -name '*eventing-sources-api.md' ! -name '*eventing-api.md' ! -name '*build-api.md' ! -name '*.git*' ! -path '*/.github/*' ! -path '*/hack/*' ! -path '*/test/*' ! -path '*/vendor/*' -exec sed -i '/](/ { /\!\[/ !s#(\.\.\/#(../../#g; /\!\[/ !s#(\.\/#(../#g; /http/ !s#README\.md#index.html#g; /http/ !s#\.md##g }' {} +
find . -type f -path '*/content/*README.md' -exec sed -i '/](/ { /http/ !s#README\.md#index.html#g; /http/ !s#\.md##g }' {} +

# GET HANDCRAFTED SITE LANDING PAGE
echo 'Move override files into the content folder'
cp -rfv content-override/* content/

# BUILD MARKDOWN
# Start HUGO build
cd themes/docsy && git submodule update -f --init && cd ../.. && hugo

# Only show published site if build triggered by PR merge
if [[ $MERGEDPR ]]
then
echo '------ CONTENT PUBLISHED ------'
echo 'Merged content will be live at:' "$URL"
else
echo '------ PREVIEW CHANGES ------'
echo 'Shared staging URL:' "$DEPLOY_PRIME_URL"
echo 'URL unique to this build:' "$DEPLOY_URL"
fi
