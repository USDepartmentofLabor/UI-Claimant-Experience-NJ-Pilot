FROM node:16.20.0-bullseye-slim as prod-deps
WORKDIR /app

COPY package.json .
COPY yarn.lock .

# hadolint ignore=DL3060
RUN yarn install --production --frozen-lockfile

FROM prod-deps AS dev-deps

# hadolint ignore=DL3060
RUN yarn install --frozen-lockfile

FROM dev-deps AS builder

COPY .eslintrc.js .
COPY tsconfig.json .
COPY tsconfig.eslint.json .
COPY next.config.js .
COPY next-i18next.config.js .
COPY *.d.ts .
COPY public ./public
COPY src ./src

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_SERVER_BASE_URL
ARG NEXT_PUBLIC_APP_ENV

RUN yarn build

# Pin sha version of gcr.io/distroless/nodejs16-debian11:nonroot
FROM gcr.io/distroless/nodejs16-debian11@sha256:221337292c9fcb2614697d135ff5d176d95fb22730bd6ea117ba593abdd5e491 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js .
COPY --from=builder /app/next-i18next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next

COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000

CMD ["./node_modules/.bin/next", "start"]
