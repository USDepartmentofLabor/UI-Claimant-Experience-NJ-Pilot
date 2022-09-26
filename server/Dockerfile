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
FROM gcr.io/distroless/java17-debian11@sha256:e10f5d5444139757302ae766416f2d62c23170015ee3f08bc125f65e177e59c2

WORKDIR /app

COPY --from=builder /app/build/libs/ui-claimant-intake-0.0.1-SNAPSHOT.jar .

CMD ["ui-claimant-intake-0.0.1-SNAPSHOT.jar"]
