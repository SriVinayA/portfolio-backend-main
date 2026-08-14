# syntax=docker/dockerfile:1

FROM --platform=linux/amd64 ghcr.io/graalvm/native-image-community:25 AS builder

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./
COPY src src

RUN chmod +x gradlew \
 && ./gradlew nativeCompile -x test --no-daemon

FROM --platform=linux/amd64 debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    zlib1g \
    libstdc++6 \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/build/native/nativeCompile/portfolio-backend-main /app/portfolio-backend-main

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/app/portfolio-backend-main"]