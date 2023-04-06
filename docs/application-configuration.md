# Application configuration

## NextJS application environment variables

### NEXT_PUBLIC_APP_ENV

The application uses the `NEXT_PUBLIC_APP_ENV` environment variable to control
certain parts of the application functionality depending on the deployed
environment (e.g., dev, test, prod). Examples in the non-production environments
include the 'Test Site' banner and the ability to reset claims.

Note: `NEXT_PUBLIC_APP_ENV` and `NODE_ENV` are **not** the same thing.

- `NODE_ENV` is `development` when running `next dev`
- `NODE_ENV` is `test` when running JavaScript tests
- `NODE_ENV` is `production` when running `next start`. `NODE_ENV` is `production`
  in all deployed environments (dev, test, prod).

The correspondence with the naming of deployed environments (dev, test, prod) is
coincidental.
