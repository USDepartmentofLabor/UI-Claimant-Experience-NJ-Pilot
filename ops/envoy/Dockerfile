FROM debian:bullseye-slim AS builder

RUN mkdir /certs /tmp/envoy

FROM public.ecr.aws/appmesh/aws-appmesh-envoy:v1.25.1.0-prod

COPY ./entrypoint.sh /bin/entrypoint.sh

# Workaround for managing permissions of a Fargate bind mount until
# https://github.com/aws/containers-roadmap/issues/938 is implemented.
# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bind-mounts.html
COPY --from=builder --chown=1337:1337 /tmp/envoy /tmp
COPY --from=builder --chown=1337:1337 /certs /certs

VOLUME ["/tmp"]
VOLUME ["/certs"]

ENTRYPOINT ["/bin/entrypoint.sh"]
