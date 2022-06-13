/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    // TODO: set up domain locales if/when we have domain routing
  },
}

module.exports = nextConfig
