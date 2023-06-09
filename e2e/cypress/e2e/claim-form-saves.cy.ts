import { generateWhoAmI } from './utils/generateWhoAmI'
import fillPrequalFields from './formPageFilling/prequal'
import { faker } from '@faker-js/faker'
import fillSsnField from './formPageFilling/ssn'
import fillScreenerFields from './formPageFilling/screener'

context('Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim', () => {
    const whoAmI = generateWhoAmI()
    cy.login({
      sub: faker.datatype.uuid(),
      whoAmI,
    })

    cy.visit('/ssn')
    fillSsnField({ ssn: '555-55-5555' })
    cy.get('[data-testid=next-button]')
      .contains('Continue')
      .scrollIntoView()
      .click()

    // screener page
    fillScreenerFields()
    cy.clickNext()

    fillPrequalFields()
    cy.clickNext()

    // Ensure the page loads
    cy.get("[data-testid='claim-form-page-heading']").should(
      'have.text',
      'Identity information'
    )

    // Go to home page to clear claim form context (local state cached form values)
    cy.visit('/')
    cy.get("button[data-testid='go-to-claim-form']")
      .scrollIntoView()
      .should('be.visible')
    cy.visit('/claim/prequal')
    cy.get('input[id=filed_in_last_12mo\\.yes]').should('be.checked')
    cy.get('[name=state_province_territory_where_filed]').should(
      'have.value',
      'AL'
    )
    cy.get('input[id=lived_outside_nj_when_working_nj\\.yes]').should(
      'be.checked'
    )
    cy.get('input[id=will_look_for_work_in_nj\\.yes]').should('be.checked')
    cy.get('input[id=can_begin_work_immediately\\.yes]').should('be.checked')
  })
})
