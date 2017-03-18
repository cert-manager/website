FROM gcr.io/google_containers/nginx-slim:0.6

ENV HUGO_VERSION=0.15
RUN \
    mkdir /tmp/hugo && \
    curl -L https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux_amd64.tar.gz | \
    tar xvzf - -C /tmp/hugo --strip-components=1 && \
    mv /tmp/hugo/hugo_0.15_linux_amd64 /usr/local/bin/hugo && \
    rm -rf /tmp/hugo

WORKDIR /var/lib/hugo
COPY static static
COPY content content
COPY layouts layouts
COPY data data
COPY config.toml .

# build and fail if error/warn is outputed
RUN rm -f log && \
    hugo -v -d /usr/share/nginx/html --logFile=log && \
    test "$(cat log | grep "^ERROR:\|^WARN:"| wc -l )" -eq "0"

EXPOSE 80
