# Unemployment Insurance Claimant Intake

Modern Unemployment Insurance (UI) intake application for the state of New Jersey Department of Labor.

## Set up

This project uses several tools which are either recommended or required for development.

### Recommended Tools

This project uses [Make](https://www.gnu.org/software/make/manual/make.html) as a convenience for environment set up
and other development commands.

> #### :information_source: Note:
>
> - On Windows, [Winget](https://docs.microsoft.com/en-us/windows/package-manager/winget/)
>   or [Chocolaty](https://chocolatey.org/) can be used to install Make.
> - It _is_ possible to interact with the project without make. To do so, simply run the commands associated with the
>   corresponding `make` commands from the [Makefile](./Makefile). Setup instructions in this project will assume the
>   installation of Make.

### Required Tools

- [Python (with PIP)](https://www.python.org/downloads/)
  - PIP is used to install [pre-commit](https://pre-commit.com/)
- [Node](https://nodejs.org/en/download/)
  - This project's required Node version can be found in [.node-version](./client/.node-version).
  - Since [Node versions](https://nodejs.org/en/about/releases/) enter and exit active LTS status regularly, using a
    Node version manager like [n](https://www.npmjs.com/package/n) or, for Windows environments,
    [nvm-windows](https://github.com/coreybutler/nvm-windows) is highly encouraged.
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)

## Dependencies

The following should install everything you need on macOS:

Sets up pre-commits:

```sh
make dev-deps
```

Sets up client app in `/clent`:

```
make client-deps
```

Sets up Cypress dependencies:

```
make e2e-deps
```

## Web Client

For more information about the web client (located in `/client`), please see the corresponding [README](./client/README.md)

## Docker Setup

To run the application locally in docker, use:

```sh
make dev-up
```

To shut the docker services down, use:

```sh
make dev-down
```

## Makefile

Run `make` or `make help` to see the available `make` commands we use with this
repository.

## Testing

### Client tests

To run the Jest unit tests:

```
make client-test
```

To run Jest unit tests that will run with every change:

```
make watch-client-test
```

To run Cypress (e2e) tests:

```
make e2e-test
```
