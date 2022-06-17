import { defineConfig } from 'cypress'
const { pa11y, prepareAudit } = require('@cypress-audit/pa11y')

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on(
        'before:browser:launch',
        (
          browser = {
            name: '',
            family: 'chromium',
            channel: '',
            displayName: '',
            version: '',
            majorVersion: '',
            path: '',
            isHeaded: false,
            isHeadless: false,
          },
          launchOptions
        ) => {
          prepareAudit(launchOptions)
        }
      )

      on('task', {
        pa11y: pa11y((pa11yReport: any) => {
          console.log(pa11yReport) // raw pa11y report
        }),
      })
    },
  },
})
