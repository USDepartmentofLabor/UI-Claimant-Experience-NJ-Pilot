# Install dependencies only when needed
# Pin sha version of node:16.16.0-bullseye-slim
FROM node@sha256:a2aad04a24d2bd4d798fe59b8dafbe6c5e3ecf143d63b8c3bc9ba194e700e130 AS deps
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16.15.1-bullseye-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY .eslintrc.yml .
COPY tsconfig.json .
COPY next.config.js .
COPY package.json .
COPY public ./public
COPY src ./src

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production image, copy all the files and run next
# Pin sha version of gcr.io/distroless/nodejs-debian11:16
FROM gcr.io/distroless/nodejs@sha256:f70e2ad790cd0df303c315c83fcb26dbd940f0ff50b9a9a84a3150eec8c7f6f6 AS runner
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
