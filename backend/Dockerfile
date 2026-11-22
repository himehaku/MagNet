FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:24-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev


FROM alpine:3.24

WORKDIR /app

RUN apk add --no-cache libstdc++ libatomic \
    && addgroup -S node \
    && adduser -S node -G node

COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]