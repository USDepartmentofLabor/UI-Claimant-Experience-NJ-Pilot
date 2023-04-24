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
import '@testing-library/cypress/add-commands'
import hkdf from '@panva/hkdf'
import { EncryptJWT, JWTPayload } from 'jose'
import Options = Cypress.Options

// Function derived from https://github.com/nextauthjs/next-auth/blob/d3571e01ba06599ca0411d14d524aa3145ba492b/packages/next-auth/src/jwt/index.ts#L119-L127
async function getDerivedEncryptionKey(secret: string) {
  return await hkdf(
    'sha256',
    secret,
    '',
    'NextAuth.js Generated Encryption Key',
    32
  )
}

// Function derived from https://github.com/nextauthjs/next-auth/blob/d3571e01ba06599ca0411d14d524aa3145ba492b/packages/next-auth/src/jwt/index.ts#L17-L26
async function encode(token: JWTPayload, secret: string) {
  const maxAge = 30 * 24 * 60 * 60 // 30 days
  const encryptionSecret = await getDerivedEncryptionKey(secret)
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(Math.round(Date.now() / 1000 + maxAge))
    .setJti('test')
    .encrypt(encryptionSecret)
}

Cypress.Commands.add('login', (userObj: JWTPayload) => {
  // Generate and set a valid cookie from the fixture that next-auth can decrypt
  cy.wrap(null)
    .then(() => {
      cy.clearLocalStorage()
      cy.clearCookies()
      return cy
        .request(
          'POST',
          `${Cypress.env('SERVER_BASE_URL')}/intake-api/dev/authenticate`,
          userObj.sub
        )
        .then((response) => {
          // Set Access Token
          userObj.accessToken = response.body

          // Set Access Token expiration to one hour in future
          userObj.accessTokenExpires = Date.now() + 60 * 60 * 1000

          return encode(userObj, Cypress.env('NEXTAUTH_SECRET'))
        })
    })
    .then((encryptedToken) => {
      const baseUrl = Cypress.config().baseUrl
      const secure = baseUrl.startsWith('https://')
      const cookieName = secure
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token'
      cy.setCookie(cookieName, encryptedToken, {
        httpOnly: true,
        secure: true,
      })
    })
})

// TODO: remove hideElements when pa11y uses WCAG 3
Cypress.Commands.add('checkA11y', (options: Options = {}) => {
  if (!Cypress.env('SKIP_A11Y')) {
    cy.pa11y({
      hideElements: 'span[class*=nav_future]',
      runners: ['htmlcs'],
      standard: 'WCAG2AA',
      actions: [
        'wait for element #page-loading to be hidden',
        'wait for element [data-testid="spinner"] to be hidden',
      ],
      ...options,
    })
  }
})

Cypress.Commands.add(
  'checkLighthouse',
  (thresholds: Cypress.LighthouseThresholds = undefined) => {
    if (!Cypress.env('SKIP_LIGHTHOUSE')) {
      if (thresholds) return cy.lighthouse(thresholds)
      else return cy.lighthouse()
    }
  }
)

Cypress.Commands.add('clickNext', (name = 'Next') => {
  cy.get('[data-testid=next-button]')
    .contains(name)
    .scrollIntoView()
    .should('be.visible')
    .click()
})

Cypress.Commands.add('clickBack', () => {
  cy.get('[data-testid=back-button]')
    .contains('Back')
    .scrollIntoView()
    .should('be.visible')
    .click()
})

Cypress.Commands.add('clickAddEmployer', () => {
  cy.get(`button[data-testid=button]`)
    .contains('Add employer')
    .should('be.visible')
    .click()
  cy.contains('h1', 'Add employer')
})

Cypress.Commands.add('clickEditEmployer', (employerName: string) => {
  cy.get(`div[data-testid="${employerName}"]`)
    .contains('Edit details')
    .should('be.visible')
    .click()
  cy.contains('h1', 'Edit employer')
})

Cypress.Commands.add('clickDeleteEmployer', (employerName: string) => {
  cy.get(`div[data-testid="${employerName}"]`)
    .contains('Delete')
    .should('be.visible')
    .click()
  cy.contains(employerName).should('not.exist')
})

Cypress.Commands.add('clickSubmit', () => {
  cy.get('[data-testid=submit-button]')
    .contains('Submit')
    .scrollIntoView()
    .should('be.visible')
    .click()
})

Cypress.Commands.add('clickLink', (link: string, text: string) => {
  cy.get(`a[href="${link}"]`)
    .contains(text)
    .scrollIntoView()
    .should('be.visible')
    .click()
})
