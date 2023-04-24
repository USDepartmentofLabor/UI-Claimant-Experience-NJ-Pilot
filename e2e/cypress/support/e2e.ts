// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import { JWTPayload } from 'jose'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to use pa11y with specific configurations
       * @example cy.check_a11y()
       */
      checkA11y(options?: Options): Chainable<Element>
      checkLighthouse(thresholds?: Cypress.LighthouseThresholds): any
      clickNext(name?: string): Chainable<Element>
      clickBack(): Chainable<Element>
      clickAddEmployer(): Chainable<Element>
      clickEditEmployer(employerName: string): Chainable<Element>
      clickDeleteEmployer(employerName: string): Chainable<Element>
      clickSubmit(): Chainable<Element>
      clickLink(link: string, text: string): Chainable<Element>
      login(userObj: JWTPayload)
    }
  }
}
