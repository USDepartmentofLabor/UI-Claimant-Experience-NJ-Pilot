# CI/CD Configurations

This project uses GitHub Actions for Continuous Integration / Continuous
Delivery/Deployment (CI/CD). See the related
[ADR](../docs/adr/0004-github-actions-for-cicd.md).

## Pull requests

When a developer opens a pull request, we run a series of checks to validate
that the code is ready for deployment. These include:

- Code formatting and other linting checks
- Static analysis checks (e.g., ESLint, SpotBugs)
- Unit tests
- End-to-end tests (Cypress)
- Accessibility tests (pa11y)
- Lighthouse tests
- Docker image and application dependency vulnerability scans (Trivy, Anchore Grype)
- OWASP ZAP scan

## Deployment (main branch)

Once a pull request is approved and merged into the `main` branch, we rerun the
checks mentioned in the `Pull requests` section above, and then run the
deployment workflow.

The deployment workflow starts by building docker images for the frontend client
(NextJS) and backend server (Spring Boot) and deploying them to separate AWS
Elastic Container Service (ECS) services in the Dev environment.

If both the client and server deployments to Dev are successful, we
automatically deploy the updated code to the Test environment.

### Deployment to dev environment (feature branch) - optional

To deploy code from a feature branch to the dev environment before the branch
has been merged, go to [Deploy Dev](https://github.com/newjersey/dol-ui-claimant-intake/actions/workflows/deploy-dev.yml),
click the `Run workflow` dropdown, select the branch to deploy, and click the
`Run workflow` button.

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

## CI/CD secrets

Secrets and sensitive information should not be committed to the code
repository, but certain CI/CD workflows rely on secrets that can be securely
stored within the GitHub repository environment as described
[here](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

GitHub has three categories of secrets:

- Actions
- Codespaces (not used in this project)
- Dependabot

Secrets are typically stored as "Actions" secrets. However, dependabot pull
requests do not have permission to access those secrets. If a dependabot pull
request needs access to secrets, those secrets must be stored as both "Actions"
secrets and "Dependabot" secrets.

"Actions" secrets are scoped either to the repository or to a specific
environment.

## GitHub environments

The repository uses [GitHub
environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
as a way to control which branches can be deployed to each AWS environment. Each
GitHub environment stores a separate set of secrets/parameters needed to deploy
code to AWS.

The names of the GitHub secrets/parameters for each environment are listed in
the table below. Their values are also stored in AWS as SSM parameters. If the
GitHub secrets need to be updated or recreated, a team member with the
appropriate AWS access can retrieve the values from SSM.

| GitHub environment | Environment secret name             | AWS environment | SSM parameter name                                                    |
| ------------------ | ----------------------------------- | --------------- | --------------------------------------------------------------------- |
| dev                | `AWS_ROLE_TO_ASSUME_DEV`            | dev             | `/dol-ui-claimant-intake-github-actions/aws-role-to-assume`           |
|                    | `DB_MIGRATIONS_SECURITY_GROUP_DEV`  |                 | `/dol-ui-claimant-intake-github-actions/db-migrations-security-group` |
|                    | `DB_MIGRATIONS_SUBNET_DEV`          |                 | `/dol-ui-claimant-intake-github-actions/db-migrations-subnet`         |
|                    | `NEXT_PUBLIC_SERVER_BASE_URL`       |                 | `/dol-ui-claimant-intake-github-actions/next-public-server-base-url`  |
| ci                 | `AWS_ROLE_TO_ASSUME_CI`           | dev             | `/dol-ui-claimant-intake-github-actions/aws-role-to-assume-ci`        |
| test               | `AWS_ROLE_TO_ASSUME_TEST`           | test            | `/dol-ui-claimant-intake-github-actions/aws-role-to-assume`           |
|                    | `DB_MIGRATIONS_SECURITY_GROUP_TEST` |                 | `/dol-ui-claimant-intake-github-actions/db-migrations-security-group` |
|                    | `DB_MIGRATIONS_SUBNET_TEST`         |                 | `/dol-ui-claimant-intake-github-actions/db-migrations-subnet`         |
|                    | `NEXT_PUBLIC_SERVER_BASE_URL`       |                 | `/dol-ui-claimant-intake-github-actions/next-public-server-base-url`  |
| prod               | `AWS_ROLE_TO_ASSUME_PROD`           | prod            | `/dol-ui-claimant-intake-github-actions/aws-role-to-assume`           |
|                    | `DB_MIGRATIONS_SECURITY_GROUP_PROD` |                 | `/dol-ui-claimant-intake-github-actions/db-migrations-security-group` |
|                    | `DB_MIGRATIONS_SUBNET_PROD`         |                 | `/dol-ui-claimant-intake-github-actions/db-migrations-subnet`         |
|                    | `NEXT_PUBLIC_SERVER_BASE_URL`       |                 | `/dol-ui-claimant-intake-github-actions/next-public-server-base-url`  |

## AWS authentication

The repository uses OpenID Connect within its workflows to authenticate with
AWS. This solves the problem of securely generating and rotating AWS access
credentials. See the following GitHub documentaton for an overview of how the
feature works.

- [About security hardening with OpenID
  Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect#configuring-the-oidc-trust-with-the-cloud)
- [Configuring OpenID Connect in Amazon Web
  Services](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

Each GitHub environment uses a different AWS Identity and Access Management
(IAM) role. Within AWS, the assume role policy attached to the IAM role
restricts access so that only a specific GitHub repository and environment can
assume the role.
