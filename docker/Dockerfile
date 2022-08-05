ARG IMAGE=node:16.13-slim
FROM $IMAGE as builder

WORKDIR /app

RUN apt-get update && apt-get -y install python g++ bash curl git make && \
  curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | sh
RUN npm install ts-node-dev -g && npm cache clean --force

FROM builder

COPY docker ./docker
COPY .npmr[c] package.json package-lock.json ./

RUN npm ci && npm cache clean --force && npm dedupe

COPY . .
RUN npm run build
