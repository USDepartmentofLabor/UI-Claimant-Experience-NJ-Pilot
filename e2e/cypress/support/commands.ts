/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// https://docs.cypress.io/guides/tooling/typescript-support#Types-for-Custom-Commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import '@cypress-audit/lighthouse/commands'
import '@cypress-audit/pa11y/commands'
import Options = Cypress.Options

Cypress.Commands.add('checkA11y', (options: Options = {}) => {
  cy.pa11y({
    runners: ['htmlcs'],
    standard: 'WCAG2AA',
    actions: ['wait for element #page-loading to be hidden'],
    ...options,
  })
})

Cypress.Commands.add('clickNext', () => {
  cy.get('[data-testid=next-button]')
    .contains('Next')
    .scrollIntoView()
    .should('be.visible')
    .click()
})

Cypress.Commands.add('clickSubmit', () => {
  cy.get('[data-testid=submit-button]')
    .contains('Submit')
    .scrollIntoView()
    .should('be.visible')
    .click()
})
