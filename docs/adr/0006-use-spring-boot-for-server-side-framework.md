# Use SpringBoot as the back end development framework

- Status: \[In progress or Decided\]
- Deciders: Joe Beck, James DeHart, Brandon Lenz, Josh Clarridge, Kim Allen, NJ DOL/DIT
- Date: 06/30/2022

Because we are working specifically with New Jersey for the option year contract, we can re-evaluate what is the best tech stack to use.
In the base year, we used Django/Python for the server-side. However, NJ engineers use Java as their preferred development language.

## Assumptions

- Needs of project: We don't expect the complexity or size of the application to get huge in the future.
- Similar to the base year, the backend server will be a dockerized application deployed to AWS

## Constraints

Include any decisions explicitly out of scope for this ADR.

## Considered Alternatives

- Python with [Django](https://www.djangoproject.com/)
- Java with [Springboot](https://spring.io/projects/spring-boot)
- [NextJS API Routes](https://nextjs.org/docs/api-routes/introduction)

## Pros and Cons of the Alternatives

### Python with Django

- `+` Existing code, patterns, and tools exist from the base year
- `+` Django is a very well documented framework with robust features for just about everything imaginable
- `+` Python is relatively easy language to learn for new folks onboarding to the project
- `+` Cross platform support
- `+` Faster getting to production than the other options due to it being a currently familiar stack used in USDOL project
- `+` NJ has used python for some workflows and automation, so it would not be totally out of place
- `+` Other digital service agencies engaging with NJ have Python experience
- `±` All Truss engineers have some level of familiarity with Python and Django
- `-` Requires a docker image with additional packages, which adds to the number of dependencies that must be managed and updated
- `-` Does not provide an embedded production server; requires configuration of additional server components
- `-` Most NJ engineers are not familiar with the Django framework and would need to learn it for continued maintenance
  of the application

### Java with Springboot

- `+` Spring is a very well documented framework with robust features for just about everything imaginable
- `+` SpringBoot makes bootstrapping a Java web app relatively easy
- `+` Cross platform support
- `+` NJ engineers use Java, so this would add less additional domain knowledge to onboard from other NJ projects to.
- `+` Can be deployed with a minimal docker image
- `+` Provides an embedded production server
- `+` In-house familiarity reduces barriers to future development and maintenance
- `±` Some Truss engineers are familiar with it, others would need to learn it
- `-` There is a steeper learning curve to learn Java when compared to Python
- `-` Time getting to production could be put at risk relative to Python Django due to needing to set up new tooling and
  facilitating learning for the Truss engineers not familiar with Java and Spring

### NextJS API Routes

- `+` Both client and server side would be in the same language (Typescript)
- `+` Cross platform support
- `+` Can be deployed with a minimal docker image
- `+` Provides an embedded production server
- `+` Other digital service agencies engaging with NJ have experience with and expect to use JS-based tech stacks
- `±` Since we are already deploying the client separately, we could use Next API Routes in addition to another framework
- `-` NextJS is a newer technology, so there is less documentation than the other options
- `-` Everyone (Truss and NJ) would need to learn NextJS API Routes, as it's not yet familiar
- `-` Time getting to production will be longer than if using Django/Python due to learning curve for the Truss engineers

## Decision Outcome

The team will use a SpringBoot application for the back end framework, using current LTS versions of Java and Spring.

This decision most heavily weights team composition and preferences of the delivery team (Truss), as well as the
maintaining team (NJ DOL/DIT).
Looking at the Truss team alone, the decision would likely fall to the Python/Django side of the equation.
We understand that NJ has a _strong_ preference to use Java and SpringBoot, and happen to be staffed to entertain that
option as well, though with potential risk to velocity and/or delivery.
Our assumption that the project's complexity exists largely on the client side, and that the server logic and
responsibilities are lean and narrow in scope, mitigates this risk to an extent.
That is not to say there would not have been risks to choosing Python/Django.
While the team would have been better positioned for delivery of an MVP using Python/Django, adoption and the ultimate
success of the project would be put at risk by the barriers to development in a less familiar tech stack from NJ's
perspective.

Understanding that many of the problems with the application that the Truss team is replacing stem from the current
app being unmaintainable, the decision to use Java and SpringBoot hopes to mitigate what we perceive as NJ's _biggest_
pain point.
We also understand that regardless of tools and languages used, rushed implementation and poorly thought out design lead
to maintenance issues, even for those with expert-level understanding, and will dedicate time and investment to bringing
the team members with less familiarity in Java and Spring up to speed, so that the quality of the deliverable is not in
question.
