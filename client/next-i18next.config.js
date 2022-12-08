// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  localePath: path.resolve('./src/i18n'),
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
}
