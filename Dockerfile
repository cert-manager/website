FROM node:21

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN npm install -g netlify-cli

USER node

COPY --chown=node:node package*.json ./

RUN npm install

EXPOSE 8888
EXPOSE 3000
