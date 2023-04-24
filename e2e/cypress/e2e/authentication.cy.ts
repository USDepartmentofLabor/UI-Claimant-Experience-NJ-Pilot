import { faker } from '@faker-js/faker'
import { generateWhoAmI } from './utils/generateWhoAmI'

context('Authentication', { scrollBehavior: 'center' }, () => {
  it('blocks access when not logged in except for privacy and home page', () => {
    cy.visit('/')
    cy.get("h1[data-testid='home-page-heading']").contains(
      'Apply for Unemployment Insurance'
    )

    cy.visit('/privacy')
    cy.get('h1').contains('Data privacy and security')

    cy.visit('/ssn')
    cy.get('button').contains('Sign in')

    cy.visit('/screener')
    cy.get('button').contains('Sign in')

    cy.visit('/claim/prequal')
    cy.get('button').contains('Sign in')
  })
  it('allows access to all pages when logged in', () => {
    const whoAmI = generateWhoAmI()
    cy.login({
      sub: faker.datatype.uuid(),
      whoAmI,
    })
    cy.visit('/')
    cy.get("h1[data-testid='home-page-heading']").contains(
      'Apply for Unemployment Insurance'
    )

    cy.visit('/privacy')
    cy.get('h1').contains('Data privacy and security')

    cy.visit('/ssn')
    cy.get('button').contains('Sign in')

    cy.visit('/screener')
    cy.get('h1').contains('Before we get started')

    cy.visit('/claim/prequal')
    cy.get('h1').contains("Let's get started")
  })
})
