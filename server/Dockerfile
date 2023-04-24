# Use a jdk image to build the application jar file
FROM eclipse-temurin:17.0.6_10-jdk AS builder

WORKDIR /app

RUN mkdir -p /tmp/app /app/certs \
  && curl -sSo /app/certs/us-east-1-bundle.pem https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem

# Download the AWS Distro for OpenTelemetry (ADOT) Java Auto-Instrumentation Agent.
# Update these arguments when upgrading to newer versions of the agent.
ARG ADOT_VERSION=1.23.0
ARG ADOT_SHA256SUM=d105926895f9b8f0bab2ce958565af41676838be208d8d17065bfa884d41e309

# hadolint ignore=DL4006
RUN curl -sSLO https://github.com/aws-observability/aws-otel-java-instrumentation/releases/download/v"${ADOT_VERSION}"/aws-opentelemetry-agent.jar \
  && [ "$(sha256sum aws-opentelemetry-agent.jar | cut -f1 -d' ')" = "${ADOT_SHA256SUM}" ]

COPY ./gradle/wrapper ./gradle/wrapper
COPY ./gradlew .
COPY ./settings.gradle .
COPY ./gradle.properties .
COPY ./build.gradle .
COPY ./src ./src

RUN ./gradlew assemble

# Use a jre image as the source from which to copy a java runtime
# into the final docker stage
FROM eclipse-temurin:17.0.6_10-jre AS jre

# Use a distroless image as the base image for deployed environments.
# Copy the application jar file and other needed dependencies from earlier
# stages.
FROM gcr.io/distroless/java-base-debian11:nonroot

WORKDIR /app

ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

COPY --from=builder --chown=65532:65532 /tmp/app /tmp/app
COPY --from=builder /app/aws-opentelemetry-agent.jar .
COPY --from=builder /app/build/libs/ui-claimant-intake-0.0.1-SNAPSHOT.jar .
COPY --from=builder /app/certs/us-east-1-bundle.pem /app/certs/us-east-1-bundle.pem
COPY --from=jre $JAVA_HOME $JAVA_HOME

VOLUME ["/tmp/app"]

ENTRYPOINT ["java"]
CMD ["-Djava.io.tmpdir=/tmp/app", "-jar", "ui-claimant-intake-0.0.1-SNAPSHOT.jar"]
