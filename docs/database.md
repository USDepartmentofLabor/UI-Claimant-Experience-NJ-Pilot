# Database

## Authentication

### Local developement

For local development, the application uses standard username/password
authentication. The configuration is managed in the `spring.datasource`
property in the following properties files:

- `server/src/main/resources/application-local.yml`: used when running the
  Spring Boot server locally outside of docker (i.e., `make server-bootRun`).
- `src/main/resources/application-local-docker.yml`: used when running the
  Spring Boot server locally in docker (i.e., `make docker-up`).

### Deployed environments

In deployed environments, the application uses [RDS IAM
authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.html).

The configuration is managed in the `spring.datasource` property in the
follwing properties file:

- `server/src/main/resources/application-aws.yml`
