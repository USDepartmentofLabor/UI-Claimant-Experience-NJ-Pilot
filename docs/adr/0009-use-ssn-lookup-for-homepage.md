# Use SSN Lookup with Forgerock for claimant portal homepage

- Status: Decided
- Deciders: Dave Cole
- Date: 12/20/2022

In order to personalize the homepage for each claimant, we need access to the claimant's social security number in order to check claim existence and claim status in all relevant systems of record.

## Assumptions

We cannot store social security numbers as a parameter in AWS Cognito. AWS Cognito documentation specifies that it is not intended for storing PPI, including social security numbers. Despite the fact that the SSN is coming from forgerock, if Cognito passes the SSN to the intake application, it will store that information.

## Constraints

While Forgerock stores and provides SSN on request, MyNJ does not. The roadmap for the application includes a migration from Forgerock to MyNJ for SSO after the application launches, and at that time, this implementation will need to be revisited.

## Considered Alternatives

- Store SSN in AWS Cognito
- Make a call to Forgerock directly for SSN and store it in the browser
- Store SSN in the application database

## Pros and Cons of the Alternatives

### Store SSN in AWS Cognito

- `+` Easiest to implement
- `-` Goes against Cognito documented uses
- `-` Will need to be changed to migrate from Forgerock to MyNJ

### Call Forgerock for SSN

- `+` Easy to implement
- `-` Will need to be changed to migrate from Forgerock to MyNJ

### Store SSN in DB

- `+` Will not need to be changed
- `±` Requires further investigation on whether the stored SSN must be verified
- `-` Hardest to implement

## Decision Outcome

In a meeting between the Nava Woodbridge team and Dave Cole on 12/20/22, it was decided that we would go forward with the option to call forgerock directly for SSN after claimant authentication in order to show them a personalized homepage. This will add tech debt for the migration from Forgerock to MyNJ, but this approach will allow us to keep the scope small for now to prioritize launching as quickly as possible. Storing the SSN in the database will be part of the SSO migration from Forgerock to MyNJ, and now we have additional time to consider the appropriate security implications of storing PPI in our AWS RDS database.
