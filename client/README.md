## Overview

**This is the Claimant-facing web application.**

- This is a [Next.js](https://nextjs.org/) React web application, written in [TypeScript](https://www.typescriptlang.org/).
- [U.S. Web Design System](https://designsystem.digital.gov) provides themeable styling and a set of common components.
- [React-USWDS](https://github.com/trussworks/react-uswds) provides React components already with USWDS theming out of the box.
- [Storybook](https://storybook.js.org/) is included as a frontend workshop.

## 💻 Development

[Next.js](https://nextjs.org/docs) provides the React framework for building the web application. Pages are defined in the `pages/` directory.

Pages are automatically routed based on the file name. For example, `pages/index.tsx` is the home page.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

[**Learn more about developing Next.js applications** ↗️](https://nextjs.org/docs)

### Getting started

See the "Set up" and "Web client" instructions in the [root README](../README.md) for instructions on how to run the application locally.

### Internationalization

All user-facing text should be internationalized. This allows us to support multiple languages in the future. [Refer to the Internationalization page for more detail](../docs/internationalization.md).

### Client-side data fetching and mutations

The app uses [React Query](https://tanstack.com/query/v3/docs/react/overview). [Query hooks](https://tanstack.com/query/v3/docs/react/guides/queries) live in [`src/queries`](./src/queries/).

A potential surprise if you haven't used React Query, is that it **caches data by default**. This means that if you call the same query hook twice, it will only make one HTTP request. If you want to make a new request, you need to pass a unique [`queryKey`](https://tanstack.com/query/v3/docs/react/guides/query-keys) to the hook.

## 🐛 Testing

### Unit and integration tests

[Jest](https://jestjs.io/docs/getting-started) is used as the test runner and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) provides React testing utilities.

Tests are managed as `.test.ts` (or `.test.tsx`) files alongside the code they are testing, except for page and API routes, which are in the `__tests__` directory.

To run tests:

- `yarn test` - Runs all tests
- `yarn run test:coverage` - Runs all tests and outputs test coverage report
- `yarn run test:update` - Updates test snapshots
- `yarn run test:watch` - Runs tests in [watch](https://jestjs.io/docs/cli#--watch) mode. Tests will re-run when files are changed, and an interactive prompt will allow you to run specific tests or update snapshots.

A subset of tests can be ran by passing a pattern to the script. For example, to only run tests in `tests/pages/`:

```sh
yarn run test:watch pages
```

### End-to-end tests

End-to-end tests are written with [Cypress](https://docs.cypress.io/), and are located in [`e2e/`](../e2e/). Within these end-to-end tests we can run automated page-level scans, for accessibility and performance best practices, using [pa11y](http://pa11y.org/) and [Lighthouse](https://developers.google.com/web/tools/lighthouse) (via [`cypress-audit`](https://mfrachet.github.io/cypress-audit/)).

## 🖼️ Storybook

Storybook is a [frontend workshop](https://bradfrost.com/blog/post/a-frontend-workshop-environment/) for developing and documenting pages and components in isolation. It allows you to render the same React components and files in the `src/` directory in a browser, without the need for a server or database. This allows you to develop and manually test components without having to run the entire Next.js application.

From the `client/` directory:

1. `yarn run storybook`
1. Navigate to [localhost:6006](http://localhost:6006) to view
