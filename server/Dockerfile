FROM eclipse-temurin:17.0.4_8-jdk AS builder

WORKDIR /app

COPY ./gradle/wrapper ./gradle/wrapper
COPY ./gradlew .
COPY ./settings.gradle .
COPY ./gradle.properties .
COPY ./build.gradle .
COPY ./src ./src

RUN ./gradlew assemble

# Pin sha version of java17-debian11:nonroot
FROM gcr.io/distroless/java17-debian11@sha256:4ae200a8d1743d5391d9b6fa82111eda6cd3e750194da060b7d303a6ea5c6f5d

WORKDIR /app

COPY --from=builder /app/build/libs/ui-claimant-intake-0.0.1-SNAPSHOT.jar .

CMD ["ui-claimant-intake-0.0.1-SNAPSHOT.jar"]
