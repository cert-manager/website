# Copyright 2025 The cert-manager Authors.
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

npm_scripts = build start dev check
.PHONY: $(npm_scripts)
$(npm_scripts): | $(NEEDS_NPM)
	$(NPM) run $@

## Vendor the node modules
## @category Development
vendor: | $(NEEDS_NPM)
	$(NPM) ci

## Build the site, which then can be served with `make start`
## @category Development
build: vendor

## Serve the site on port 3000
## @category Development
start: vendor

## Start the dev server, this server will reload for every change you make to
## the codebase
## @category Development
dev: vendor

## Run code linting and checks
## @category Development
check: vendor

##########
# NodeJS #
##########

# https://nodejs.org/dist/v22.19.0/SHASUMS256.txt.asc
NODE_linux_amd64_SHA256SUM=d36e56998220085782c0ca965f9d51b7726335aed2f5fc7321c6c0ad233aa96d
NODE_linux_arm64_SHA256SUM=d32817b937219b8f131a28546035183d79e7fd17a86e38ccb8772901a7cd9009
NODE_darwin_amd64_SHA256SUM=3cfed4795cd97277559763c5f56e711852d2cc2420bda1cea30c8aa9ac77ce0c
NODE_darwin_arm64_SHA256SUM=c59006db713c770d6ec63ae16cb3edc11f49ee093b5c415d667bb4f436c6526d

.PRECIOUS: $(bin_dir)/scratch/node@$(NODE_VERSION)_%
$(bin_dir)/scratch/node@$(NODE_VERSION)_%: | $(bin_dir)/scratch
	$(CURL) https://nodejs.org/dist/$(NODE_VERSION)/node-$(NODE_VERSION)-$(subst amd64,x64,$(subst _,-,$*)).tar.gz -o $@.tar.gz
	$(checkhash_script) $@.tar.gz $(NODE_$*_SHA256SUM)
	mkdir -p $@
	tar xzf $@.tar.gz --strip-components=1 -C $@
	rm -f $@.tar.gz

$(DOWNLOAD_DIR)/tools/node@$(NODE_VERSION)_%: | $(bin_dir)/scratch/node@$(NODE_VERSION)_% $(DOWNLOAD_DIR)/tools
	$(LN) $(CURDIR)/$(bin_dir)/scratch/node@$(NODE_VERSION)_$*/bin/node $@

$(DOWNLOAD_DIR)/tools/npm@$(NPM_VERSION)_%: | $(bin_dir)/scratch/node@$(NPM_VERSION)_% $(DOWNLOAD_DIR)/tools
	$(LN) $(CURDIR)/$(bin_dir)/scratch/node@$(NODE_VERSION)_$*/bin/npm $@

# Export the node bin dir so npm can work
export PATH := $(CURDIR)/$(bin_dir)/scratch/node@$(NODE_VERSION)_$(HOST_OS)_$(HOST_ARCH)/bin:$(PATH)