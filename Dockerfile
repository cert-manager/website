FROM gcr.io/google_containers/nginx-slim:0.6

ADD _output/ /usr/share/nginx/html/
