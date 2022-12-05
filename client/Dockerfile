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
FROM gcr.io/distroless/nodejs16-debian11@sha256:4653eb0ad97cfb03eef69c62305271580a8485649c6e9d75548bd9ea853f6bff AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

USER 1001

EXPOSE 3000

ENV PORT 3000

CMD ["./node_modules/.bin/next", "start"]
