#!/usr/bin/env bash

# Copyright 2019 The Jetstack cert-manager contributors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

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
