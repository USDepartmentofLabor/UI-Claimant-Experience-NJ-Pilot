FROM eclipse-temurin:17.0.4_8-jdk AS builder

WORKDIR /app

COPY ./gradle/wrapper ./gradle/wrapper
COPY ./gradlew .
COPY ./settings.gradle .
COPY ./build.gradle .
COPY ./src ./src

RUN ./gradlew build -x test

# Pin sha version of java17-debian11:nonroot
FROM gcr.io/distroless/java17-debian11@sha256:45e1a255d67d80cc3484c3cf4ff8b8e65d3b28bbda1c1d293874de5c79ee1075

WORKDIR /app

COPY --from=builder /app/build/libs/ui-claimant-intake-0.0.1-SNAPSHOT.jar .

CMD ["ui-claimant-intake-0.0.1-SNAPSHOT.jar"]
