# RDS IAM authentication

- Status: Decided
- Deciders: Josh Clarridge
- Date: 2023-04-03

The claimant intake application uses an Amazon Relational Database Service (RDS)
PostgreSQL instance as its backend database for storing claims metadata. RDS
provides multiple options for database user authentication, so projects using
RDS will need to decide which approach to use for their application.

This is a retrospective ADR documenting a decision that was made earlier in the
project.

## Considered Alternatives

- IAM database authentication
- Password authentication

## Pros and Cons of the Alternatives

### IAM database authentication

With this approach, RDS IAM authentication is enabled at the RDS instance level.
Database users/roles are created in a database and granted the `rds_iam` ROLE.
Instead of using long-lived passwords, database connections are authenticated
and established using short-term tokens that can be periodically re-generated
using AWS SDK calls. Permission to use a particular database user role is
controlled with AWS IAM, similar to how IAM is used to manage permissions
elsewhere in the AWS environment.

From the AWS documentation\[2\]:

> Each token has a lifetime of 15 minutes.... The token is only used for
> authentication and doesn't affect the session after it is established.

This means that once a database connection is established with a short-term
token, the connection can remain open as long as needed. New tokens need to
generated when authenticating new connections, but tokens do not need to be
refreshed for existing connections once they have successfully authenticated.

Limitations to be aware of (from the AWS RDS documentation\[2\]):

> - In general, consider using IAM database authentication when your
>   applications create fewer than 200 connections per second, and you don't
>   want to manage usernames and passwords directly in your application code.
> - The maximum number of connections per second for your DB instance might be
>   limited depending on its DB instance class and your workload.

- `+` Reduces the number of user passwords that need to be stored in the
  database
- `+` RDS IAM authentication is configurable per user. For example, if a
  database has RDS IAM authentication enabled, a database administrator could
  use IAM authentication for `user1` and password authentication for `user2`.
- `+` Once configured, minimizes long-term overhead of rotating user passwords
- `+` For the claimant intake application, the database connection is handled by
  the Spring Boot server. There were several code samples available online
  describing how to approach the token generation and refresh for Hikari
  database connection pools, which simplified the initial implementation.
  Configurable options in the Spring Boot properties files enabled using
  password authentication for local development and IAM authentication for
  deployed environments.
- `+` The claimant intake application should be creating far fewer than 200
  connections second, and therefore is not expected to be impacted by the
  documented limitations for IAM authentication
- `-` Requires more application code updates to configure initially than
  password authentication
- `-` Only supported for MariaDB, MySQL, and PostgreSQL

### Password authentication

With this option, database authentication is handled with a standard username
and password.

- `+` Standard database authentication method that should work for all
  applications and databases
- `+` Avoids potential limitations for IAM authentication documented above
- `-` Requires storing more passwords in the database
- `-` Does not scale well as more database users are created using password
  authentication
- `-` Requires additional overhead to rotate passwords. The rotation would need
  to be done manually or automated with Lambda functions that AWS provides for
  this purpose.

## Decision Outcome

Use RDS IAM authentication for the claimant intake application's primary
application database user. Use password authentication for the RDS master user
and rely on other mechanisms to rotate the master user password. For all other
database users, use RDS IAM authentication.

## References

- `[1]` [Database authentication with Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/database-authentication.html)
- `[2]` [IAM database authentication for MariaDB, MySQL, and
  PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html)
