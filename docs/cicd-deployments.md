# CI/CD Configurations

This project uses GitHub Actions for Continuous Integration / Continuous
Delivery/Deployment (CI/CD). See the related
[ADR](../docs/adr/0004-github-actions-for-cicd.md).

## Pull requests

When a developer opens a pull request, we run a series of checks to validate
that the code is ready for deployment. These include, but are not limited to,
code linting, unit tests, and end-to-end tests.

## Deployments

Once a pull request is approved and merged into the `main` branch, we rerun the
checks mentioned in the `Pull requests` section above, and then run the
deployment workflow.

The deployment workflow starts by building docker images for the frontend client
(NextJS) and backend server (Spring Boot) and deploying them to separate AWS
Elastic Container Service (ECS) services in the Dev environment.

If both the client and server deployments to Dev are successful, we
automatically deploy the updated code to the Test environment.

## Docker images + environments

The frontend client (NextJS) relies on build-time environment variables that
must be set differently for each environment. Therefore, we build a separate
client docker image for each environment (dev, test, prod) as part of the
deployment workflow.

The backend server (Spring Boot) relies only on run-time configurations
(environment variables and spring boot properties); it does not depend on
environment-specific build-time environment variables. Therefore, we only build
the backend server image once per deployment workflow. The image is built and
pushed to the Dev AWS Elastic Container Registry (ECR) repository and then
promoted to Test and Prod by allowing the Test and Prod accounts to pull the
images from the Dev ECR repository.
