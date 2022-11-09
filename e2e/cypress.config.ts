import { defineConfig } from 'cypress'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { lighthouse, prepareAudit } = require('@cypress-audit/lighthouse')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { pa11y } = require('@cypress-audit/pa11y')

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  lighthouse: {
    thresholds: {
      accessibility: 100,
      'best-practices': 90,
      seo: 90,
      pwa: 20,
      performance: 30,
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
        lighthouse: lighthouse((lighthouseReport) => {
          console.log('---- Writing lighthouse report to disk ----')
          console.log(process.cwd())

          fs.writeFile(
            'lighthouse.json',
            lighthouseReport.report,
            (error: any) => {
              error
                ? console.log(error)
                : console.log('Report created successfully')
            }
          )
        }),
        pa11y: pa11y((pa11yReport: any) => {
          console.log(pa11yReport) // raw pa11y report
        }),
      })
    },
  },
})
