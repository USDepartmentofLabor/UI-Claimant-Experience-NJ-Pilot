# Build greenfield, leveraging pilot project code <!-- The title should reflect the decision outcome -->

- Status: Decided
- Deciders: @kimallen, @Igarfinkle, @brandonlenz
- Date: 05/19/2022

The Truss team built an application for USDOL in the “Base Year” portion of our DOL contract. In the “Option Year” we
are working directly with the state of New Jersey to build a solution more specific to their needs, hosted within their
infrastructure. Because the Base Year solution was built for a different use-case (centralized, state-agnostic-ish
claimant intake), we know that not all the code is relevant to the goals and functionality of NJ in the option year.

## Assumptions

- Large portions of front end code (at the very least) from the prototype are relevant to the NJ development effort.
- Application presentation layers are inherently more portable, as they tend to be more loosely coupled to system
  architecture.
- The back-end prototype from the base year was built assuming centralized architecture, and is not easily refactored to
  serve other purposes.
- The back-end prototype is not complex enough that architecting a suitable replacement would put project deliverables
  at risk.
- The back-end prototype accumulated technical debt to support 2 very distinct claimant flows due to quick, decisive
  project pivots towards the end of the base year.
- Drastic tech stack changes are not likely to occur from the base year to the option year, making _all_ of the base
  year code strong reference material at the very least.

## Constraints

None other than ensuring that the chosen option does not stall build momentum (every option risks this in some way, so it
is important to be aware of)

## Considered Alternatives

- Clone prototype repository entirely
- Copy entire React app
- Build greenfield, leveraging pilot project code

## Pros and Cons of the Alternatives

### Clone prototype repository entirely

- `+` "Functional" application right out of the gate.
- `+` Core code is all instantly present.
- `+` Commit history is preserved.
- `+` Existing tests and test coverage are retained.
- `---` Cruft of base year use cases and pivots present obstacles to iterating quickly, and would require dedicated
  efforts to refactor and/or remove.
  - Entire Arkansas "ID only" flow.
  - Model entities for state-specific SWAs.
  - Login.gov integration.
  - Asymmetric claim encryption (this was done to allow each state a keypair, but to prevent USDOL or any other state
    from being able to decrypt submitted claims in the centralized model. In the base year, NJ is encrypting and
    decrypting claim data, so there would be no need to use asymmetric encryption).
  - Configurations for USDOL hosted/purchased external tools and services would need reverse engineering.
  - etc.
- `-` Lose the ability to re-evaluate the tech stack and other core architectural decisions for the option year.

### Copy entire React App

- `+` The React app represents the portion of the pilot project that was built with NJ input, and is also most portable,
  so this brings the most relevant portion of code in quickly, and leaves out the less relevant/portable back-end.
- `+` Probably the fastest option for getting a "viewable" (but non-functional) intake form to NJ.
- `±` Existing tests and test coverage are retained, though end-to-end tests would not work without the back-end.
- `±` Brings the entirety of the base year CRA configuration.
- `-` Brings all the technical debt and challenges of the base year app.
- `-` Leaves little room for foundational application improvements.
- `-` We lose the git commit history for the parts we reuse.
- `-` Lose the ability to re-evaluate the tech stack and other core architectural decisions related to the front-end.

### Build greenfield, leveraging pilot project code

- `+` Offers the team the most design and build flexibility.
- `+` Leanest option making it easy to include only what we need.
- `+` Sets the team up to be able to iterate on the desired solution and new features best, long-term.
- `+` Leads to the most maintainable product which is not confined by architectural decisions made under context not
  relevant to the application's actual use cases.
- `+` Naturally facilitates review of documentation as each relevant piece from the prototype is reintroduced.
- `+` Makes onboarding to the codebase easier.
- `±` Existing unit tests could be used in a TDD fashion while working to achieve parity with the prototype, though
  including existing tests is a manual action developers need to remember to do.
- `±` May require solving problems that had already been solved with the first prototype, again.
  - On one hand, this provides opportunities to evaluate design decisions that might not have been ideal.
  - On the other hand, this uses up time that could be spent dealing with new decisions.
- `-` Likely the slowest option to reaching parity with the base year intake form.
- `-` We lose the git commit history for the parts we reuse.

## Decision Outcome: Build greenfield, leveraging pilot project code

This option positions us to best make use of a T&M contract to build the right solution from the ground up. We are still
well positioned to reuse component code to quickly reach claim form parity from a user perspective, but also have the
ability to identify technical debt and use lessons learned to make better design choices during the rebuild.
