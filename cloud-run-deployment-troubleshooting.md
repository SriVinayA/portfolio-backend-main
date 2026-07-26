# Cloud Run Deployment Fix: GraalVM Native Image Architecture Mismatch

## Background: Why This Was Necessary

The original deploy script used `gcloud run deploy --source .`, which
hands the build off to Cloud Build's default (free-tier) machine type.
For a GraalVM native-image build, this remote build was taking **15+
minutes per deploy** — slow enough to be a real drag on iteration speed.

To speed this up, the approach was changed to build the native image
**locally** with `./gradlew bootBuildImage` and push the finished image
directly to Artifact Registry, skipping Cloud Build's remote compile step
entirely.

This immediately surfaced a new problem: the build machine is a MacOS
machine with Apple Silicon (arm64), and **Cloud Run does not support
arm64 images** — it requires `linux/amd64`. A native local build produces
an arm64 image by default, so it would never run on Cloud Run as-is.

That constraint — needing an amd64 image, built on an arm64 machine, without
falling back to the slow Cloud Build path — is what led to using Docker's
QEMU-based cross-platform emulation (`--imagePlatform=linux/amd64`) to
build amd64 images locally. The architecture mismatch issue documented
below (a stale build cache silently reusing an arm64-compiled binary
inside an amd64-labeled image) was a direct consequence of introducing
that emulation step.

## Summary

Deploying a locally-built GraalVM native image to Cloud Run failed with
`exec format error`, even though the image was correctly tagged and labeled
as `linux/amd64`. The root cause was a **stale build cache** from a prior
Apple Silicon (arm64) build being reused during a supposedly amd64 build,
causing an arm64 binary to be packaged inside an amd64-labeled image.

---

## Environment

- **Machine:** MacOS, Apple Silicon (arm64)
- **Build tool:** Gradle + Spring Boot `bootBuildImage` (Cloud Native Buildpacks / Paketo)
- **Runtime:** GraalVM native image
- **Target:** Google Cloud Run (requires `linux/amd64`)
- **Emulation:** Docker Desktop's built-in QEMU

---

## Timeline of the Problem

### 1. Initial deploy script used `--source .`

The original deploy script built a native image locally and pushed it to
Artifact Registry, but the actual Cloud Run deploy step used
`gcloud run deploy --source .`, which triggers an **entirely separate**
remote Cloud Build build. This meant the locally built/pushed image was
never actually deployed — wasted build time, and a `--build-env-vars` flag
typo (`--build-env-vars` should be `--set-build-env-vars`) surfaced as the
first visible error.

### 2. Decision: deploy the locally built image directly

To avoid double builds, the script was changed to use
`gcloud run deploy --image=...` instead of `--source .`, deploying the
exact image built locally via Gradle.

### 3. Problem: Apple Silicon builds arm64 by default

Since the build machine is Apple Silicon, `./gradlew bootBuildImage`
produced an **arm64** image by default. Cloud Run only runs `amd64`, so
this would never have worked.

### 4. Fix attempt: `--imagePlatform=linux/amd64`

Spring Boot's `bootBuildImage` task supports an `--imagePlatform` flag
(confirmed available via `./gradlew help --task bootBuildImage`), which
tells Buildpacks to pull `amd64` builder/run images and build under QEMU
emulation (confirmed available via `docker buildx ls`).

```bash
./gradlew bootBuildImage \
  --imageName=${FULL_IMAGE_PATH} \
  --imagePlatform=linux/amd64
```

This **built successfully in ~21 seconds** — suspiciously fast for a native
image compile, which is normally CPU-intensive and takes minutes.

### 5. False positive: `docker image inspect` showed `amd64`

```bash
docker image inspect <image> --format '{{.Architecture}}'
# → amd64
```

This looked correct, so the image was pushed and deployed.

### 6. Deployment failure

```
Default STARTUP TCP probe failed 1 time consecutively for container ... on port 8080.
ERROR: failed to launch: direct exec: exec format error
```

Cloud Run runs on real amd64 hardware (no emulation), so `exec format error`
means the binary inside the container was **not actually x86-64 machine
code** — despite the image manifest claiming `amd64`.

### 7. Root cause identified

The Buildpacks build cache volume (`pack-cache-*.build`) used by
`bootBuildImage` **is not automatically platform-scoped**. Because an
earlier build had populated that cache with an arm64-compiled native image
layer (`paketo-buildpacks/bellsoft-liberica:native-image-svm`), the
`--imagePlatform=linux/amd64` build reused that cached layer instead of
recompiling — silently baking arm64 machine code into an image labeled
`amd64`. `docker image inspect Architecture` only reflects the manifest's
declared platform, not the real architecture of the compiled binary, so it
didn't catch the mismatch.

---

## The Fix

### 1. Force a clean rebuild, bypassing the cache

```bash
./gradlew bootBuildImage \
  --imageName=${FULL_IMAGE_PATH} \
  --imagePlatform=linux/amd64 \
  --cleanCache
```

This forced Buildpacks to discard the cached native-image-svm layer and
genuinely recompile for amd64. Build time jumped to **~6m 55s**, consistent
with a real native-image compile under QEMU emulation.

### 2. Verify the actual binary architecture (not just the image manifest)

`docker image inspect` isn't reliable for this — it reflects the platform
declared in the manifest, not the real ELF architecture of the compiled
binary. To check the real architecture, extract the binary and inspect it
directly:

```bash
docker create --platform linux/amd64 --name temp-check <image>
docker cp temp-check:/workspace/<application-binary> ./binary-check
docker rm temp-check
file ./binary-check
```

Expected output:

```
./binary-check: ELF 64-bit LSB pie executable, x86-64, ...
```

This confirmed the binary was genuinely x86-64, unlike the first build.

### 3. Push and deploy

```bash
docker push ${FULL_IMAGE_PATH}

gcloud run deploy portfolio-backend-main-service \
  --image=${FULL_IMAGE_PATH} \
  --region=us-central1 \
  --project=arctic-odyssey-503605-k0 \
  --allow-unauthenticated \
  --execution-environment=gen2
```

Deployment succeeded — revision served 100% of traffic without errors.

---

## Final Working Script

```bash
#!/bin/bash
set -e

PROJECT_ID="arctic-odyssey-503605-k0"
REGION="us-central1"
ARTIFACT_REPO="portfolio-backend-main-artifacts"
IMAGE_NAME="portfolio-backend-main-image"
SERVICE_NAME="portfolio-backend-main-service"

VERSION=$(git rev-parse --short HEAD)
FULL_IMAGE_PATH="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${VERSION}"

echo "🚀 Starting deployment for commit '${VERSION}'..."
echo "📦 Image destination: ${FULL_IMAGE_PATH}"

echo "🔑 Configuring Docker authentication..."
gcloud auth configure-docker ${REGION}-docker.pkg.dev --quiet

echo "🛠️ Compiling GraalVM native image (linux/amd64) locally using Gradle + QEMU emulation..."
./gradlew bootBuildImage \
  --imageName=${FULL_IMAGE_PATH} \
  --imagePlatform=linux/amd64 \
  --cleanCache

echo "☁️ Pushing image to Google Artifact Registry..."
docker push ${FULL_IMAGE_PATH}

echo "🚀 Deploying to Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image=${FULL_IMAGE_PATH} \
  --region=${REGION} \
  --project=${PROJECT_ID} \
  --allow-unauthenticated \
  --execution-environment=gen2

echo "✅ Successfully deployed revision for Git commit ${VERSION}!"
```

---

## Key Takeaways

1. **`docker image inspect --format '{{.Architecture}}'` is not sufficient
   verification** when switching target platforms on a machine that has
   previously built for a different platform. It reports the manifest's
   declared platform, not the real architecture of the compiled binary.

2. **Buildpacks' cache volume is not platform-aware by default.** Switching
   `--imagePlatform` between builds on the same machine can silently reuse
   cached layers (like a compiled native-image binary) from a previous,
   different-architecture build.

3. **`--cleanCache` is required whenever `--imagePlatform` changes** or
   whenever there's any doubt about what's cached, to guarantee a genuine
   rebuild for the target platform.

4. **To truly verify architecture**, extract the compiled binary from the
   image and run `file` on it directly — this checks the real ELF header,
   which can't be fooled by manifest labels or stale caches.

5. **Build time is a useful sanity signal.** A native-image compile that
   completes suspiciously fast (~20s vs. the expected several minutes) is
   a strong hint that compilation was skipped via cache reuse rather than
   genuinely performed.

6. **Tradeoff going forward:** always using `--cleanCache` guarantees
   correctness but forces a full ~7 minute native-image recompile on every
   deploy, eliminating most of the speed benefit of building locally. This
   is worth weighing against simply letting Cloud Build handle the amd64
   build remotely via `gcloud run deploy --source .`, which avoids the
   cache/emulation risk entirely at the cost of using Cloud Build's own
   infrastructure and turnaround time.
