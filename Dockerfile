# Hugo build
FROM alpine:3.12 as build

ENV HUGO_VERSION=0.74.3
ENV HUGO_CHECKSUM=269482fff497051a7919da213efa29c7f59c000e51cf14c1d207ecf98d87bf33

RUN apk add --no-cache openssl ca-certificates && \
  mkdir -p /tmp/hugo && \
  cd /tmp/hugo && \
  wget https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -O hugo.tar.gz && \
  echo "${HUGO_CHECKSUM}  hugo.tar.gz" | sha256sum -c && \
  tar xvf hugo.tar.gz && ls && cp hugo /usr/bin/hugo && \
  rm -rf /tmp/hugo

WORKDIR /website
COPY . .

RUN hugo --environment=production --minify

# NGINX container
FROM nginx:1.19.2-alpine

COPY --from=build /website/public /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
