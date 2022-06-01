# Unemployment Insurance Claimant Intake

Modern Unemployment Insurance (UI) intake application for the state of New Jersey Department of Labor.

## Dependencies

The following should install everything you need on macOS:

```sh
make dev-deps
```

## Web Client Setup

To set up and run the web client application, please see the corresponding [README](./client/README.md)

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
