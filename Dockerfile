FROM alpine:3.5

RUN apk update && apk add ca-certificates

WORKDIR /www
ADD _build/backend-linux-amd64 /backend
ADD _output/ /www

USER 1000

ENV GIN_MODE=release
CMD ["/backend"]
