// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    // TODO: set up domain locales if/when we have domain routing
  },
  localePath: path.resolve('./src/i18n'),
}

module.exports = nextConfig
