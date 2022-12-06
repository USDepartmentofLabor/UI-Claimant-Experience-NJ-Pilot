FROM node:16.18.1-bullseye-slim as prod-deps
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production --frozen-lockfile

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

# Pin sha version of gcr.io/distroless/nodejs16-debian11:nonroot
FROM gcr.io/distroless/nodejs16-debian11@sha256:14f3946b89191f4a38a0bac03c969111c7e96da3a1832804949f19a467484c06 AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next

COPY --from=prod-deps /app/node_modules ./node_modules

EXPOSE 3000

ENV PORT 3000

CMD ["./node_modules/.bin/next", "start"]
