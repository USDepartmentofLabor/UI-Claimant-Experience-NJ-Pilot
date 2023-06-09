import { defineConfig } from 'cypress'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pa11y } = require('@cypress-audit/pa11y')

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  lighthouse: {
    thresholds: {
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
      pwa: 20,
      performance: 0,
    },
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on(
        'before:browser:launch',
        (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        lighthouse: lighthouse(),
        pa11y: pa11y((pa11yReport: any) => {
          console.log(pa11yReport) // raw pa11y report
        }),
      })
    },
  },
})
