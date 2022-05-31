# Serve client and server separately <!-- The title should reflect the decision outcome -->

- Status: In progress
- Deciders: \[Names of deciders\]
- Date: 05/31/22

In the base year, we served the client within the Django app, and served them both in the same Docker container
(see [Serving Static Assets ADR](https://github.com/USDOLEnterprise/ARPAUI/blob/main/docs/adr/0004-serving-static-assets.md)).
In the option year, we are working within different constraints, and can consider serving each separately.

## Assumptions

We will be using Docker regardless. There is not significant additional cost to run a second container.

## Considered Alternatives

- Serve the client and server separately
- Serve the client and server together

## Pros and Cons of the Alternatives

### Option 1

- `+` We can do server-side rendering through Nextjs if desired
- `+` Separation of concerns is cleaner and less confusing, supporting current and future developers and interested SWAs
- `+` Separating them is more modular than if not
- `+` We can do caching
- `±` We'd need to set up two servers instead of one, though it's relatively easy with Docker
- `-` There are two servers to maintain and vulnerabilities to manage
- `-` We'd need to figure out how to distinguish domain names
- `-` There is some effort to figure out how to set up React env variables (these were previously managed from server side)

### Option 2

- `+` We can follow similar patterns we used in the base year
- `+` We can do caching
- `-` Less clean, more confusing
- `-` Less modular

## Decision Outcome

Option 1: Serve the client and server separately
The overall benefits of cleaner, clearer organization outweigh the minimal overhead in setting up and maintaining a second container.
