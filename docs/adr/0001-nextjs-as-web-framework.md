# Use Next.js as the front end development framework

- Status: In progress
- Deciders: @kimallen, @Igarfinkle, @brandonlenz
- Date: 05/19/2022

Before beginning work on a front-end application, we need to choose a framework
on which the application will be built. The framework should be flexible, customizable, 
and scalable.

## Assumptions

 - Using Next.js still allows us to reuse React code from ARPA-UI Pilot app.

## Considered Alternatives

- Use React with Next.js
- Use React without Next.js
- Render the application server-side with Django

## Pros and Cons of the Alternatives

### Use React with Next.js

- `+` Next.js is a growing industry standard for building web applications
- `+` Next.js offers options for server-side rendering, client-side rendering, 
and static site generation, allowing increased flexibility for making the app
faster to load.
- `-` Requires configuring a new framework
- `-` Inevitably some overhead to understand how to configure the new framework,
and additional learning time to understand how and when to use server-side rendering, etc.

### Use React without Next.js

- `+` The app from the ARPA-UI Pilot already uses Create React App, and 
configuration could be effortlessly ported over
- `-` CRA is, at this point, poorly maintained
- `-` Offers only client-side rendering.

### Render the application server-side with Django

- `+` Would unify our code in one language/framework
- `-` Django may not be appropriate for some of our more complex interactions,
such as autosaving, validation.
- `-` Would not allow us to easily copy work from base year app.

## Decision Outcome: Use React with Next.js AND do not use Django templating at all

Next.js is a growing industry standard for building web applications,
as it combines the familiarity of React development with the flexibility
of server-side rendering and static site generation, leading to faster 
build and run times. We expect that much of the frontend code for this
project will be copied from the ARPAUI pilot application, and Next.js 
keeps this sufficiently straightforward, since it is built on top of React.
Since Next.js provides options for server-side rendering, we will not
use Django templating for server-side rendered pages. 
