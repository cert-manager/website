REGISTRY := eu.gcr.io/jetstack-gke
IMAGE_NAME := website
BUILD_TAG := build
IMAGE_TAGS := canary
IMAGE_TAG := latest
ENVIRONMENT := dev
HELM := helm3

PACKAGE_NAME := gitlab.jetstack.net/jetstack/website/backend
GOOS := linux
GOARCH := amd64
GOLANG_VERSION := 1.8.1
GOLANG_CONTAINER_DIR := /go/src/$(PACKAGE_NAME)

NAMESPACE := $(IMAGE_NAME)-$(ENVIRONMENT)
RELEASE_NAME := $(IMAGE_NAME)-$(ENVIRONMENT)
CHART_PATH := contrib/charts/jetstack-website
HELM_VALUES := .values.$(ENVIRONMENT).yaml

HUGO_BASE_URL := "https://www.jetstack.io"
INGRESS_HOSTNAME := website-$(ENVIRONMENT).kube.jetstack.net
REPLICA_COUNT=3

.PHONY: help
help:
	# Jetstack Website Makefile
	#
	# clean - Remove leftover build artifacts
	# test - Run tests
	# hugo_serve - Build Hugo image & run 'hugo serve'. Used for development environment.
	# hugo_build_image - Build the Hugo docker image
	# hugo_build - Build Hugo image & build the website within it. Outputs to ./_output
	# golang_build - Builds the backend golang binary
	# docker_build - Build the site as a Docker image (run hugo_build BEFORE this target!)
	# docker_push - Build & push the website docker image. Pushes image with all tags listed in $${IMAGE_TAGS}
	# test_helm - Runs helm test
	# deploy - Deploys the website as a Helm chart. See contrib/charts/jetstack-website/values.yaml for options
	# destroy - Destroys a helm release! Run 'make destroy SURE=1 ENVIRONMENT=env-name' to run.

clean:
	rm -Rf _output/ _build/ .hugo-log

.PHONY: test
test: test_helm

hugo_build_image:
	docker build -t $(REGISTRY)/$(IMAGE_NAME):hugo -f Dockerfile.hugo .

hugo_serve: hugo_build_image
	docker rm -f jetstack_website_dev || true
	docker run -it \
		--rm \
		--name jetstack_website_dev \
		-p 1313:1313 \
		-v $(CURDIR):/var/lib/hugo \
		$(REGISTRY)/$(IMAGE_NAME):hugo

hugo_build: hugo_build_image
	# clean up
	rm -rf _output .hugo-log
	# create a container
	$(eval HUGO_CONTAINER_ID := $(shell docker create \
		$(REGISTRY)/$(IMAGE_NAME):hugo \
		hugo --environment=production --minify -v -d /var/lib/hugo/_output --logFile=/tmp/.hugo-log))
	docker cp . $(HUGO_CONTAINER_ID):/var/lib/hugo
	docker start -a $(HUGO_CONTAINER_ID)
	docker cp $(HUGO_CONTAINER_ID):/tmp/.hugo-log .
	cat .hugo-log > /dev/stderr
	test "$$(cat .hugo-log | grep "^ERROR\|^WARN"| wc -l )" -eq "0"
	docker cp $(HUGO_CONTAINER_ID):/var/lib/hugo/_output .
	docker rm -f $(HUGO_CONTAINER_ID)


golang_build:
	# create a container
	$(eval GOLANG_CONTAINER_ID := $(shell docker create \
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
	$(HELM) lint $(CHART_PATH)

prepare_gke:
	gcloud container clusters get-credentials jetstack-gke --zone europe-west1-b --project jetstack-gke

deploy: prepare_gke
	touch $(HELM_VALUES)
	$(HELM) upgrade $(RELEASE_NAME) $(CHART_PATH) --install --namespace $(NAMESPACE) \
		--set 'image.tag=$(IMAGE_TAG)' \
		--set 'ingressHostname={$(INGRESS_HOSTNAME)}' \
		--set 'ingress.hosts[0].host=$(INGRESS_HOSTNAME)' \
		--set 'ingress.tls[0].hosts[0]=$(INGRESS_HOSTNAME)' \
		--set 'replicaCount=$(REPLICA_COUNT)' \
		--values $(HELM_VALUES) \
		--dry-run #wait

destroy: prepare_gke
	@test "$${SURE}" -ne "0"
	$(HELM) delete $(RELEASE_NAME)
