import '../src/styles/styles.scss'
import '@trussworks/react-uswds/lib/index.css'
import '../src/i18n/i18n'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
