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