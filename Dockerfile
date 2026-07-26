FROM ghcr.io/graalvm/graalvm-community:25 AS build
WORKDIR /app
COPY . .
RUN ./gradlew nativeCompile --no-daemon

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=build /app/build/native/nativeCompile/portfolio-backend-main /app/app
EXPOSE 8080
ENTRYPOINT ["/app/app"]