FROM eclipse-temurin:17.0.4_8-jdk AS builder

WORKDIR /app

RUN mkdir -p /tmp/app /app/certs \
  && curl -sSo /app/certs/us-east-1-bundle.pem https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem

COPY ./gradle/wrapper ./gradle/wrapper
COPY ./gradlew .
COPY ./settings.gradle .
COPY ./gradle.properties .
COPY ./build.gradle .
COPY ./src ./src

RUN ./gradlew assemble

# Pin sha version of java17-debian11:nonroot
FROM gcr.io/distroless/java17-debian11@sha256:9e1350a76265de67ee256af1af84628552629d01ea0082d33fac865d6f915a7b

WORKDIR /app

COPY --from=builder --chown=65532:65532 /tmp/app /tmp/app
COPY --from=builder /app/build/libs/ui-claimant-intake-0.0.1-SNAPSHOT.jar .
COPY --from=builder /app/certs/us-east-1-bundle.pem /app/certs/us-east-1-bundle.pem

VOLUME ["/tmp/app"]

CMD ["-Djava.io.tmpdir=/tmp/app", "ui-claimant-intake-0.0.1-SNAPSHOT.jar"]
