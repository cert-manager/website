REGISTRY := eu.gcr.io/jetstack-gke
IMAGE_NAME := website
BUILD_TAG := build
IMAGE_TAGS := canary
IMAGE_TAG := latest
ENVIRONMENT := dev

PACKAGE_NAME := gitlab.jetstack.net/jetstack/website/backend
GOOS := linux
GOARCH := amd64
GOLANG_VERSION := 1.8.1
GOLANG_CONTAINER_DIR := /go/src/$(PACKAGE_NAME)

NAMESPACE := $(IMAGE_NAME)-$(ENVIRONMENT)
RELEASE_NAME := $(IMAGE_NAME)-$(ENVIRONMENT)
CHART_PATH := contrib/charts/jetstack-website
HELM_VALUES := .values.$(ENVIRONMENT).yaml


.PHONY: build
build: ; docker build -f Dockerfile.dev -t ${IMAGE} .

.PHONY: serve
serve: ; @$(call run_container,$(IMAGE))

test: test_helm

docker_build_hugo:
	docker build -t $(REGISTRY)/$(IMAGE_NAME):hugo -f Dockerfile.hugo .

hugo_serve: docker_build_hugo
	docker rm -f jetstack_website_dev || true
	docker run -it \
		--rm \
	--name jetstack_website_dev \
	-p 1313:1313 \
	-v $(CURDIR):/var/lib/hugo \
	$(REGISTRY)/$(IMAGE_NAME):hugo

hugo_build: docker_build_hugo
	# clean up
	rm -rf _output .hugo-log
	# create a container
	$(eval HUGO_CONTAINER_ID := $(shell docker create \
		$(REGISTRY)/$(IMAGE_NAME):hugo \
		hugo -v -d /var/lib/hugo/_output --logFile=/tmp/.hugo-log))
	docker cp . $(HUGO_CONTAINER_ID):/var/lib/hugo
	docker start -a $(HUGO_CONTAINER_ID)
	docker cp $(HUGO_CONTAINER_ID):/tmp/.hugo-log .
	test "$$(cat .hugo-log | grep "^ERROR\|^WARN"| wc -l )" -eq "0"
	cat .hugo-log > /dev/stderr
	docker cp $(HUGO_CONTAINER_ID):/var/lib/hugo/_output .
	docker rm -f $(HUGO_CONTAINER_ID)


golang_build:
	# create a container
	$(eval GOLANG_CONTAINER_ID := $(shell docker create \
		-e CGO_ENABLED=0 \
		-e CGO_ENABLED=0 \
		-e GOOS=$(GOOS) \
		-e GOARCH=$(GOARCH) \
		-w $(GOLANG_CONTAINER_DIR) \
		golang:$(GOLANG_VERSION) \
		go build -a -tags netgo -o _build/backend-$(GOOS)-$(GOARCH)))
	docker cp backend/ $(GOLANG_CONTAINER_ID):$(shell dirname $(GOLANG_CONTAINER_DIR))
	docker start -a $(GOLANG_CONTAINER_ID)
	rm -rf _build/
	docker cp $(GOLANG_CONTAINER_ID):$(GOLANG_CONTAINER_DIR)/_build .
	docker rm -f $(GOLANG_CONTAINER_ID)

docker_build:
	docker build -t $(REGISTRY)/$(IMAGE_NAME):$(BUILD_TAG) .

docker_push: docker_build
	set -e; \
		for tag in $(IMAGE_TAGS); do \
		docker tag $(REGISTRY)/$(IMAGE_NAME):$(BUILD_TAG) $(REGISTRY)/$(IMAGE_NAME):$${tag} ; \
		docker push $(REGISTRY)/$(IMAGE_NAME):$${tag}; \
	done

test_helm:
	helm lint $(CHART_PATH)

deploy:
	touch $(HELM_VALUES)
	helm upgrade $(RELEASE_NAME) $(CHART_PATH) --install --namespace $(NAMESPACE) \
		--set 'image.tag=$(IMAGE_TAG)' \
		--set 'ingressHostnames={website-$(ENVIRONMENT).kube.jetstack.net}' \
		--values $(HELM_VALUES) \
		--wait
