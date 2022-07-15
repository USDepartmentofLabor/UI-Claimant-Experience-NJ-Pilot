const fillDisabilityStatusFields = (disabilityStatus) => {
  const {
    has_collected_disability,
    disabled_immediately_before,
    type_of_disability,
    date_disability_began,
    recovery_date,
    contacted_last_employer_after_recovery,
  } = disabilityStatus

  cy.get(
    `input[id=disability\\.has_collected_disability\\.${has_collected_disability}]`
  )
    .parent()
    .click()

  if (disabled_immediately_before) {
    cy.get(
      `input[id=disability\\.disabled_immediately_before\\.${disabled_immediately_before}]`
    )
      .parent()
      .click()
  }

  if (type_of_disability) {
    cy.get('#disability\\.type_of_disability').select(type_of_disability)
  }

  if (date_disability_began) {
    cy.get(`input[id=disability\\.date_disability_began`)
      .should('be.visible')
      .type(date_disability_began)
  }

  if (recovery_date) {
    cy.get(`input[id=disability\\.recovery_date`)
      .should('be.visible')
      .type(recovery_date)
  }

  if (contacted_last_employer_after_recovery) {
    cy.get(
      `input[id=disability\\.contacted_last_employer_after_recovery\\.${contacted_last_employer_after_recovery}]`
    )
      .parent()
      .click()
  }
}

export default fillDisabilityStatusFields
