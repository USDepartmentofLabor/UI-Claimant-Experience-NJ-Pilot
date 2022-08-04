FROM node:16.16.0-bullseye-slim AS builder
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

RUN yarn build

# Pin sha version of gcr.io/distroless/nodejs-debian11:16
FROM gcr.io/distroless/nodejs@sha256:f70e2ad790cd0df303c315c83fcb26dbd940f0ff50b9a9a84a3150eec8c7f6f6 AS runner
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
