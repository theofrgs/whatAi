FROM node:18 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn global add pnpm && \
  pnpm install --no-frozen-lockfile && \
  pnpm store prune
COPY . .
CMD ["pnpm", "run", "start:dev"]

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN yarn global add pnpm && \
  pnpm install --no-frozen-lockfile && \
  pnpm store prune
COPY . .
RUN pnpm build && \
  pnpm prune --prod

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV PORT 8080

CMD ["node", "dist/main.js"]
