FROM debian:bullseye-slim AS builder

RUN mkdir /tmp/envoy

FROM public.ecr.aws/appmesh/aws-appmesh-envoy:v1.25.1.0-prod

# Workaround for managing permissions of a Fargate bind mount until
# https://github.com/aws/containers-roadmap/issues/938 is implemented.
# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bind-mounts.html
COPY --from=builder --chown=1337:1337 /tmp/envoy /tmp

VOLUME ["/tmp"]
