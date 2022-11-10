# Use Cognito integrated with Forgerock for MVP app

> **Note:** The contents of this ADR were taken from [this PDF](<https://sonj.sharepoint.com/:b:/r/sites/DOLPublicUIClaimantPortal/Shared%20Documents/Architecture/Architectural%20Decision%20Records%20(ADRs)/001%20-%20ADR%20-%20Access%20Management%20%26%20User%20Attributes%20Data_Accepted.pdf?csf=1&web=1&e=6MaZnY>)
> as the decision was circulated outside GitHub for business stakeholder approval. That PDF should be considered the
> source of truth, though it is expected that it will not change.

- Status: Decided
- Deciders: Gillian Gutierrez, Joe Beck
- Date: 09/27/2022

We need to determine which claimant attributes are necessary in order to start an Unemployment Insurance claim, and where
these attributes will be stored.

This is important because it could impact business decisions around access management providers (ForgeRock, MyNJ) as
well as architectural and user experience dimensions of the Claimant Intake App.

## Assumptions

- It is not feasible to move SSI to MyNJ. This would require refactoring to SSI. Instead, we should think about
  decommissioning SSI first or at the same time as a MyNJ change
- New Jersey's ForgeRock system will be the claimant intake application's initial access manager
- The long-term goal is to migrate to MyNewJersey as the claimant intake application's access manager
- MyNewJersey does not support the following data fields for claimants:
  - SSN
  - Birthdate
  - Phone Number

## Constraints

Our solution needs to account for the following:

- It must support deployment of an MVP version of the Claimant Intake App, which will run in parallel to the existing
  SSI intake process.
- It must be directionally aligned with longer-term scenarios where the SSI intake process is retired completely.
- It must not increase dependency on the SSI application or user flow.
- It must follow best practices for storing and securing PII in any potentially new locations.
- It must consider the role that ID.me (or the long-term IdP more generally) will play in establishing claimant
  uniqueness and correctness of identity information in the future.

## Considered Alternatives

- Send a selected number of data fields to Cognito and others to the Application (not including SSN)
- Send all attributes to Cognito
- Access additional fields directly from ForgeRock

## Pros and Cons of the Alternatives

### Send a selected number of data fields to Cognito and others to the Application (not including SSN)

- `+` No backend integration between Intake App and ForgeRock (Access Manager)
- `+` Forward-compatible with MyNJ(since fields not be available in MyNJ profile)
- `+` Fastest speed-to-delivery by starting with bare-bones data, adding other fields as appropriate and feasible
- `±` Security is in-house for PII, no exposure in 3rd-party applications (i.e. Cognito)
- `-` Data re-entry required by Claimants (i.e. SSN, potentially more)
- `-` Potential for mismatched data in ForgeRock record and claim record

### Send all attributes to Cognito

- `+` All attributes in ForgeRock available for claim app
- `+` No backend integration
- `+` No potential data mismatch
- `-` Complicates security settings in Cognito
- `-` Requires refactoring later to accommodate MyNJ

### Access additional fields directly from ForgeRock

- `+` All attributes for claim app (including SSN)
- `+` No potential data mismatch
- `+` No complicated security settings in Cognito
- `±` Less refactoring for MyNJ than Option 2
- `-` Requires a backend integration

## Decision Outcome

Option 1
