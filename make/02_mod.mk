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

# https://nodejs.org/dist/v20.11.1/SHASUMS256.txt.asc
NODE_linux_amd64_SHA256SUM=bf3a779bef19452da90fb88358ec2c57e0d2f882839b20dc6afc297b6aafc0d7
NODE_linux_arm64_SHA256SUM=e34ab2fc2726b4abd896bcbff0250e9b2da737cbd9d24267518a802ed0606f3b
NODE_darwin_amd64_SHA256SUM=c52e7fb0709dbe63a4cbe08ac8af3479188692937a7bd8e776e0eedfa33bb848
NODE_darwin_arm64_SHA256SUM=e0065c61f340e85106a99c4b54746c5cee09d59b08c5712f67f99e92aa44995d

.PRECIOUS: $(bin_dir)/scratch/node@$(NODE_VERSION)_%
$(bin_dir)/scratch/node@$(NODE_VERSION)_%: | $(bin_dir)/scratch
	$(CURL) https://nodejs.org/dist/$(NODE_VERSION)/node-$(NODE_VERSION)-$(subst amd64,x64,$(subst _,-,$*)).tar.gz -o $@.tar.gz
	$(checkhash_script) $@.tar.gz $(NODE_$*_SHA256SUM)
	mkdir -p $@
	tar xzf $@.tar.gz --strip-components=1 -C $@
	rm -f $@.tar.gz

$(bin_dir)/downloaded/tools/node@$(NODE_VERSION)_%: | $(bin_dir)/scratch/node@$(NODE_VERSION)_% $(bin_dir)/downloaded/tools
	$(LN) $(CURDIR)/$(bin_dir)/scratch/node@$(NODE_VERSION)_$*/bin/node $@

$(bin_dir)/downloaded/tools/npm@$(NPM_VERSION)_%: | $(bin_dir)/scratch/node@$(NPM_VERSION)_% $(bin_dir)/downloaded/tools
	$(LN) $(CURDIR)/$(bin_dir)/scratch/node@$(NODE_VERSION)_$*/bin/npm $@

# Export the node bin dir so npm can work
export PATH := $(CURDIR)/$(bin_dir)/scratch/node@$(NODE_VERSION)_$(HOST_OS)_$(HOST_ARCH)/bin:$(PATH)