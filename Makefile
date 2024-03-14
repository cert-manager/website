.PHONY: docker-build
docker-build:
	@docker build --tag test-cert-manager.io .

.PHONY: docker-rm
docker-rm:
	@docker rm -f test-cert-manager.io
	@docker rm -f verify-cert-manager.io

.PHONY: docker-clean
docker-clean: docker-rm
	@docker image rm test-cert-manager.io

.PHONY: server
server: docker-build
	@docker run -d --name test-cert-manager.io --rm -p 3000:3000 -p 8888:8888 -v ${PWD}:/home/node/app -v /home/node/app/node_modules test-cert-manager.io ./scripts/server

.PHONY: verify
verify: docker-build
	@docker run --rm --name verify-cert-manager.io -v ${PWD}:/home/node/app -v /home/node/app/node_modules test-cert-manager.io ./scripts/verify

.PHONY: release
release: docker-build
	@docker run --rm --name verify-cert-manager.io -v ${PWD}:/home/node/app -v /home/node/app/node_modules test-cert-manager.io ./scripts/build-release
