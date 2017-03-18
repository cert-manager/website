VERSION :=1.0
IMAGE ?= jetstack/website:${VERSION}

run_container=docker run -it --rm \
	--name jetstack_website \
	-p 1313:1313 \
	-v $$PWD:/usr/share/website \
	$(IMAGE)

.PHONY: build
build: ; docker build -f Dockerfile.dev -t ${IMAGE} .

.PHONY: serve
serve: ; @$(call run_container,$(IMAGE))
