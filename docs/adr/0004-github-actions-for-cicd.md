# Use GitHub Actions for CI/CD

- Status: Decided
- Deciders: @kimallen, @lgarfinkle, @brandonlenz, @jsclarridge
- Date: 2022-05-27

Setting up your CI/CD pipeline early is a piece of automation that will pay off
in the long run. Doing so means that developers will get used to the idea that
their changes will be put, at the very least, into a real running environment
every time they push, which means that building in tests and operability are not
optional components or things to be added later.

Which tool to use on any given project will be influenced by a particular team's
preferences, existing tooling or constraints within an organization, as well as
the current state of available CI/CD offerings.

In the base year, we used GitHub Actions as our primary CI tool, but used
Jenkins for deployment based on existing tooling and constraints. For the option
year, our preference is to use one tool for CI/CD, to shorten the feedback loop
and reduce the operational overhead.

## Assumptions

- The code will be hosted in a private repository. This has cost implications,
  as some CI/CD tools are free for public repositories but not for private
  repositories.

## Considered Alternatives

- GitHub Actions
- CircleCI
- AWS suite of offerings (e.g., CodeBuild, CodePipeline, CodeDeploy)

## Pros and Cons of the Alternatives

### GitHub Actions

- `+` Already used in the base year, so existing workflows can be reused with
  minimal modifications
- `+` The development team has experience with it
- `+` Already in use within the New Jersey GitHub org
- `+` Simplifies developer experience as the code and CI workflow are co-located
- `+` Workflows run in dedicated virtual machines by default
- `+` Broad offering of reusable actions in the GitHub Actions marketplace
- `-` Not free for private repositories
- `-` Does not support docker layer caching as a built-in feature

### CircleCI

- `+` The development team has experience with it
- `+` Already in use within the New Jersey GitHub org
- `+` Offers docker layer caching as a built-in feature
- `-` Not used in the base year, so existing workflows would need to be rewritten
- `-` Complicates developer experience as the code and CI workflow are not
  co-located
- `-` Running CI workflows within a docker image introduces complexity around
  maintaining custom base images and running docker commands within the workflow
  (docker-in-docker)

### AWS suite of offerings (e.g., CodeBuild, CodePipeline, CodeDeploy)

- `+` We are deploying to AWS, so these tools have built-in integration with our
  deployed environments
- `-` The development team does not have experience with these tools, so adding
  a new tool would introduce an unknown and risk

## Decision Outcome

Use GitHub Actions as the single tool for CI/CD as this will maximize the
development team's productivity and allow them to devote their energy towards
building out the application's features and functionality.
