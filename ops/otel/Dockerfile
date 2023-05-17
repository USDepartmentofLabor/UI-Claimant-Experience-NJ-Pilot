# The system's ECS tasks cannot pull images from the public AWS ECR registry in
# deployed environments. In order to use public AWS ECR images, do the image
# pull in the CI pipeline and push it to a private ECR repository within the
# environment.
FROM public.ecr.aws/aws-observability/aws-otel-collector:v0.29.0

# Add an arbitrary version label. Updating the base image tag in the FROM line
# above will cause CI to build and push a new image to ECR. If needing to build
# a new version of the same base image, incrementing the version number below
# provides another mechanism to trigger a fresh CI build.
LABEL dol-ui-claimant-intake-otel-collector-version=1
