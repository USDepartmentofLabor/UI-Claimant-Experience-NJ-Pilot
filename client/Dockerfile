FROM node:16.18.1-bullseye-slim AS builder
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --frozen-lockfile

COPY .eslintrc.yml .
COPY tsconfig.json .
COPY next.config.js .
COPY public ./public
COPY src ./src

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_SERVER_BASE_URL
ARG NEXT_PUBLIC_APP_ENV

RUN yarn build

# Pin sha version of gcr.io/distroless/nodejs16-debian11
FROM gcr.io/distroless/nodejs16-debian11@sha256:c390cb18ed46d8f73455c8a2f26e7c508117b40f9de2ae0edde72dbcf141e5a2 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000

CMD ["./node_modules/.bin/next", "start"]
