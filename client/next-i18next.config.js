// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    // TODO: set up domain locales if/when we have domain routing
  },
  localePath: path.resolve('./src/i18n'),
}
