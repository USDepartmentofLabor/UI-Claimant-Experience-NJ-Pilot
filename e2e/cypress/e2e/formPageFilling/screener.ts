const fillScreenerFields = () => {
  cy.get('input[id=screener_current_country_us\\.yes]').parent().click()
  cy.get('input[id=screener_military_service_eighteen_months\\.no]')
    .parent()
    .click()
  cy.get('input[id=screener_job_last_eighteen_months\\.yes]').parent().click()
  cy.get('input[id=screener_work_nj\\.both]').parent().click()
  cy.get('input[id=screener_currently_disabled\\.no]').parent().click()
  cy.get('input[id=screener_federal_work_in_last_eighteen_months\\.no')
    .parent()
    .click()
  cy.get('input[id=screener_maritime_employer_eighteen_months\\.no]')
    .parent()
    .click()
}

export default fillScreenerFields
