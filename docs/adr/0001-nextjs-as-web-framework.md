# Use Next.js as the web development framework

- Status: In progress
- Deciders: Kim Allen, Isaac Garfinkle, Brandon Lenz
- Date: 05/28/2022

Before beginning work on a front-end application, we need to choose a framework
on which the application will be built. The framework should be flexible, customizable, 
and scalable.

## Assumptions


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

### Use React without Next.js

- `+` The app from the ARPA-UI Pilot already uses Create React App, and 
configuration could be effortlessly ported over
- `-` CRA is, at this point, poorly maintained

### Render the application server-side with Django

- `+` Would unify our code in one language/framework
- `-` Django may not be appropriate for some of our more complex interactions,
such as autosaving, validation.
- `-` Would not allow us to easily copy work from base year app.

## Decision Outcome: Use React with Next.js

Next.js is a growing industry standard for building web applications,
as it combines the familiarity of React development with the flexibility
of server-side rendering and static site generation, leading to faster 
build and run times. We expect that much of the frontend code for this
project will be copied from the ARPAUI pilot application, and Next.js 
keeps this sufficiently straightforward, since it is built on top of React.
