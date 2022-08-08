const fillAbleAndAvailableFields = (disabilityStatus) => {
  const {
    can_begin_work_immediately,
    has_collected_disability,
    disabled_immediately_before,
    type_of_disability,
    date_disability_began,
    recovery_date,
    contacted_last_employer_after_recovery,
  } = disabilityStatus

  cy.get(
    `input[id=able_and_available\\.can_begin_work_immediately\\.${can_begin_work_immediately}]`
  )
    .parent()
    .click()

  cy.get(
    `input[id=able_and_available\\.has_collected_disability\\.${has_collected_disability}]`
  )
    .parent()
    .click()

  if (disabled_immediately_before) {
    cy.get(
      `input[id=able_and_available\\.disabled_immediately_before\\.${disabled_immediately_before}]`
    )
      .parent()
      .click()
  }

  if (type_of_disability) {
    cy.get(
      `input[id=able_and_available\\.type_of_disability\\.${type_of_disability}]`
    )
      .parent()
      .click()
  }

  if (date_disability_began) {
    cy.get('input[name=able_and_available\\.date_disability_began\\.month]')
      .clear()
      .type(date_disability_began.mo)
    cy.get('input[name=able_and_available\\.date_disability_began\\.day]')
      .clear()
      .type(date_disability_began.day)
    cy.get('input[name=able_and_available\\.date_disability_began\\.year]')
      .clear()
      .type(date_disability_began.yr)
  }

  if (recovery_date) {
    cy.get('input[name=able_and_available\\.recovery_date\\.month]')
      .clear()
      .type(recovery_date.mo)
    cy.get('input[name=able_and_available\\.recovery_date\\.day]')
      .clear()
      .type(recovery_date.day)
    cy.get('input[name=able_and_available\\.recovery_date\\.year]')
      .clear()
      .type(recovery_date.yr)
  }

  if (contacted_last_employer_after_recovery) {
    cy.get(
      `input[id=able_and_available\\.contacted_last_employer_after_recovery\\.${contacted_last_employer_after_recovery}]`
    )
      .parent()
      .click()
  }
}

export default fillAbleAndAvailableFields