# Repository Structure <!-- The title should reflect the decision outcome -->

- Status: In progress
- Deciders: @kimallen, @Igarfinkle, @brandonlenz
- Date created: 05/17/2022

## Description and background on decision to be made
This application will be built to support New Jersey DOL while serving as a learning model for other state workforce agencies.
An initial MVP was built under USDOL as a centralized system, and this code is being ported over to a NJ-specific repository. 
The centralized USDOL project lives in a Django project with multiple apps side-by-side, including `claimant` app as the React frontend app, 
`api` and `swa` apps as the backend-focused apps, and `home` that holds the server-rendered user-facing templates.

## Assumptions

We have limited time and people hours for the engagement, so added overhead matters.
We want to have something easy to maintain when maintenance of the codebase is handed over to clients.
This ADR assumes continued use of Django as a framework.

## Constraints

This ADR does not cover decisions on stack or tools

## Considered Alternatives

- Option 1: Split out frontend and backend into different repositories
- Option 2: Keep frontend and backend in the same repository
  - 2A: . . .and maintain the same structure as the USDOL project (React code is one app amidst multiple)
  - 2B: . . .and split the project into frontend and backend apps

## Pros and Cons of the Alternatives

### Option 1: Split code into frontend and backend repositories

- `+` This increases modularity of the application, which may better support other states
- `+` versioning can be independent for both frontend and backend
- `+` Security concerns will be separated, with fewer concerns on the frontend
- `-` The schema and validation fixtures are shared by the frontend and backend, so would be hard to separate
- `-` Code management can be difficult. We wouldn't always know which repo in which to create an issue if there is a bug.
- `-` Writing backend to frontend verticals means working within two repositories and multiple PRs
- `-` Requires onboarding to two repos rather than one
- `-` End to end and integration tests would be difficult- changes in one repo could break things in the other

### Option 2: Keep client-side and server-side code in the same repository

- `+` To set up the application, only one repository needs to be cloned and managed
- `+` We tend to work full stack and in feature verticals, so it would be easy to move around the code in one repo
- `+` Application-wide refactors are easier
- `+` Debugging can be easier when looking at one repo
- `+` Only one repo to manage and documentation can be in one place
- `+` Since we are using Github Issues for task management, it's easier to have it in one repo
- `+` End to end and integration tests are easier when code is in the same repo
- `-` The division frontend and backend code would be less distinct and potentially less modular/reuseable by states

#### Option 2A: maintain the same structure as we have in the USDOL-ARPA-UI project
- `+` Time/energy are not expended to restructure
- `-` Developers found the structure somewhat confusing and unintuitive

#### Option 2B: Split the code into frontend and backend apps within one repo and create sub-apps within them
- `+` The directory structure will be easier to follow
- `+` It will be easier for newcomers to onboard and understand the code and easier
- `+` When publicly available, the code will be easier for other states to follow
- `-` Developers will have to adjust to a different directory structure than they were working with the past several months

## Decision Outcome

**Option 2B: Split the code into client-side and server-side apps within one repo and create sub-apps within them**

Many of the benefits of using two repositories apply to a larger codebase and larger teams than is relevant to this project,
so splitting it out seems like unnecessary overhead. While we are porting over the re-useable code from the USDOL repo to the NJ repo, 
there is minimal overhead in restructuring the repository into clearly defined backend and frontend apps.

## Resources

[Should frontend and backend be in separate repositories?](https://softwareengineering.stackexchange.com/questions/417953/should-frontend-and-backend-be-on-separate-github-repos)

[How to create subapps in Django](https://stackoverflow.com/questions/2862084/how-do-i-create-sub-applications-in-django)

[Mono-repo vs. Multi-repo](https://kinsta.com/blog/monorepo-vs-multi-repo/)