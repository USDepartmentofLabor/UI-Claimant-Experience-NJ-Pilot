# Install dependencies only when needed
FROM node:16.15.1-bullseye-slim AS deps
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16.15.1-bullseye-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY .eslintrc.json .
COPY tsconfig.json .
COPY next.config.js .
COPY package.json .
COPY pages ./pages
COPY public ./public
COPY styles ./styles

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
FROM gcr.io/distroless/nodejs:16 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER 1001

EXPOSE 3000

ENV PORT 3000

CMD ["./node_modules/.bin/next", "start"]
