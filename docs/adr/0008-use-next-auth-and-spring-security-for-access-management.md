# Use Next-Auth and Spring Security for enforcing access management

- Status: Decided
- Deciders: Brandon Lenz, Josh Clarridge
- Date: 10/11/2022

Having two applications (NextJS and Spring Boot) requires authentication and authorization mechanisms for front-end routes as well as back-end api endpoints.

## Assumptions

- There will be front-end pages that require a user being authenticated to access
- There will be back-end api requests that require user information to perform their function, which should rely on
  authentication accompanying user information so that users can only alter their own claim data, for example
- There may be front-end pages that do not require authentication to access, and do not make calls to protected api endpoints

## Constraints

- Cognito is the authentication provider per [ADR 0007](./0007-use-cognito-for-authentication.md)

## Considered Alternatives

- Use only Spring Security with server-side sessions
- Use only NextAuth
- Use Amplify
- Use NextAuth and Spring Security with JWTs

## Pros and Cons of the Alternatives

### Use only Spring Security with server-side sessions

- `+` Spring Security is a powerful, flexible framework for securing Spring Boot applications with minimal configuration
- `+` Using a server-side session cache keeps sensitive PII away from the client
- `-` Requires provisioning a centralized session cache (i.e. Redis) as additional infrastructure so that sessions are
  not coupled to application instances
- `-` The front end would need to be tightly coupled to the back end for authentication and authorization, likely
  requiring frequent server api calls, even for standard page-to-page routing
- `-` The back end would need knowledge of front-end routes so that it could perform access management duties
- `-` The back end would be responsible for managing session timeouts, meaning long periods of "inactivity" (from the
  back end's perspective), would lead to requiring re-authentication, without the front end knowing about it. A user
  filling out a long form page might need to be polled for extending a session if their actions are not otherwise
  triggering api requests

### Use only NextAuth

- `+` NextAuth is a powerful, flexible framework for securing NextJS applications with minimal configuration
- `+` Allows the NextJS client app to manage access to its own pages, preventing tight coupling to the server
- `+` NextAuth interfaces with Amazon Cognito as a provider out of the box
- `-` Does not provide a mechanism for protecting API routes to the Spring Boot server, and is therefore a non-starter.
  NextAuth is only suitable as an all-encompassing solution for the NextJS client _and_ server (which we do not use, see
  [ADR-0006](./0006-use-spring-boot-for-server-side-framework.md))

### Use Amplify

- `+` It has authentication libraries specifically for integration with Amazon Cognito
- `+` Used by at least one other NJ application
- `+` Integrates well with Cypress for e2e testing
- `-` The team has little to no familiarity with the Amplify framework
- `-` The intake application does not otherwise use the Amplify framework

### Use [NextAuth](https://next-auth.js.org/) and [Spring Security](https://spring.io/projects/spring-security) with JWTs

- `+` Spring Security is a powerful, flexible framework for securing Spring Boot applications with minimal configuration
- `+` NextAuth is a powerful, flexible framework for securing NextJS applications with minimal configuration
- `+` Spring Security allows the Spring Boot application to manage access to api endpoints with no coupling to the client
- `+` NextAuth allows the NextJS application to manage access to client pages with no coupling to the Spring Boot server
- `+` Both tools validate Cognito tokens easily, and can share the Cognito issued JWT
- `+` Using JWTs for "session" management means there is no need to be concerned about which application instance a user
  is connected to, and is unaffected by application scaling.
- `±` Each app manages its own configuration, which means configuration lives in two different places
- `-` Requires knowledge of two security frameworks
- `-` Requires two applications to be configured to interface with Cognito
- `-` Using JWTs for "session" management means that an application should avoid storing any sensitive user information
  in the JWT, limiting its usefulness when compared to server-managed sessions

## Decision Outcome

Using NextAuth and Spring Security with Cognito issued JWTs best suits the application's architecture, and provides the
most flexibility with the fewest drawbacks.
