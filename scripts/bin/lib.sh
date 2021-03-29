#!/usr/bin/env bash

# This script constructs a 'content/' directory that contains content for all
# configured versions of the documentation.

set -o errexit
set -o nounset
set -o pipefail

# autodetects host GOOS and GOARCH and exports them if not set
detect_and_set_goos_goarch() {
  # if we have go, just ask go! NOTE: this respects explicitly set GOARCH / GOOS
  if which go >/dev/null 2>&1; then
    GOARCH=$(go env GOARCH)
    GOOS=$(go env GOOS)
  fi

  # detect GOOS equivalent if unset
  if [ -z "${GOOS:-}" ]; then
    case "$(uname -s)" in
    Darwin) export GOOS="darwin" ;;
    Linux) export GOOS="linux" ;;
    *) echo "Unknown host OS! '$(uname -s)'" exit 2 ;;
    esac
  fi

  # detect GOARCH equivalent if unset
  if [ -z "${GOARCH:-}" ]; then
    case "$(uname -m)" in
    x86_64) export GOARCH="amd64" ;;
    arm*)
      export GOARCH="arm"
      if [ "$(getconf LONG_BIT)" = "64" ]; then
        export GOARCH="arm64"
      fi
      ;;
    *) echo "Unknown host architecture! '$(uname -m)'" exit 2 ;;
    esac
  fi

  export GOOS GOARCH
}

check_sha() {
  filename="$1"
  sha="$2"

  detect_and_set_goos_goarch
  if [ "$GOOS" = "darwin" ]; then
    echo "$sha  $filename" | shasum -a 256 -c
  elif [ "$GOOS" = "linux" ]; then
    echo "$sha  $filename" | sha256sum -c
  else
    echo "Unsupported OS: $GOOS"
    return 1
  fi
}
