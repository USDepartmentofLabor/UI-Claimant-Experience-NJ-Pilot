# Database users/roles

## Overview

This document describes the database roles the application will use for two use
cases: (1) applying database migrations, (2) normal running of the application.

## Background

The application uses a PostgreSQL database. The default user (often referred to
as the master user) of a new PostgreSQL database has elevated/superuser
permissions. It is not best practice to use that user in an application.
Instead, it is best practice to create separate database users with only the
minimum required permissions to carry out their functions.

For local development, using the default `postgres` user in a local dockerized
environment can be convenient. Similarly, using an AWS RDS instance's default
master user can be convenient for initial testing. But defining an application's
approach to database user management early on and aligning with best practices
from the beginning can help in the long run.

## Proposed solution

Create two database users for the application, one to handle database migrations
(i.e., schema updates) and one to handle the routine operation of the
application (i.e., inserting, updating, and deleting records).

This implies or presupposes that applying database migrations will be a distinct
step, separate from application startup. Spring Boot, and other similar web
frameworks, can be configured to automatically apply database migrations upon
application startup, which is convenient but has a tradeoff in that it requires
granting the application's database user slightly elevated permissions.

## Implementation

- Create database migrations for creating the users/roles in the local/CI
  docker development environment
- Create database migrations for creating the users/roles in the deployed
  environments
- Configure a step in the CI/CD pipeline to run database migrations

## Trade-offs

- Adds some complexity to the initial database setup
- Adds some complexity to the CI/CD pipeline
- But this is a common pattern and aligns with the best practice of running the
  application with only the minimum required database permissions

## Further reading

- [Master user account
  privileges](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.MasterAccounts.html)
- [Managing PostgreSQL users and
  roles](https://aws.amazon.com/blogs/database/managing-postgresql-users-and-roles/)
