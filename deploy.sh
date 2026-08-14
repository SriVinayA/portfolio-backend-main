#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="arctic-odyssey-503605-k0"
REGION="us-central1"
REPOSITORY="portfolio-backend-main-artifacts"
SERVICE="portfolio-backend-main-service"
IMAGE_NAME="portfolio-backend-main"
TAG="native-amd64"

LOCAL_IMAGE="${IMAGE_NAME}:${TAG}"
REMOTE_IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:${TAG}"

echo "==> Selecting Google Cloud project"
gcloud config set project "${PROJECT_ID}"

echo "==> Verifying Artifact Registry Container authentication"
gcloud auth print-access-token | \
  container registry login us-central1-docker.pkg.dev \
    --username=oauth2accesstoken \
    --password-stdin

echo "==> Building linux/amd64 native image"
container build \
  --arch amd64 \
  --cpus 8 \
  --memory 16g \
  -t "${LOCAL_IMAGE}" \
  .

echo "==> Tagging image"
container image tag "${LOCAL_IMAGE}" "${REMOTE_IMAGE}"

echo "==> Pushing image"
container image push "${REMOTE_IMAGE}"

echo "==> Deploying to Cloud Run"
gcloud run deploy "${SERVICE}" \
  --image="${REMOTE_IMAGE}" \
  --region="${REGION}" \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080

SERVICE_URL="$(gcloud run services describe "${SERVICE}" \
  --region="${REGION}" \
  --format='value(status.url)')"

echo
echo "Deployment completed."
echo "Service URL: ${SERVICE_URL}"
echo "Health URL: ${SERVICE_URL}/actuator/health"

echo
echo "==> Removing local images"

container image rm "${LOCAL_IMAGE}" || true
container image rm "${REMOTE_IMAGE}" || true

echo "==> Local image cleanup complete"