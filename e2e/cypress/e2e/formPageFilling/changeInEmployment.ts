type dateField = {
  mo: string
  day: string
  yr: string
}
type ChangeInEmploymentOptions = {
  separation_circumstance: string
  expect_to_be_recalled?: boolean
  employment_start_date?: dateField
  employment_last_date?: dateField
}

const fillChangeInEmployment = (
  employerIndex,
  options: ChangeInEmploymentOptions
) => {
  cy.get(
    `input[id=employers\\[${employerIndex}\\]\\.separation_circumstance\\.${options.separation_circumstance}`
  )
    .parent()
    .click()

  if (options.employment_start_date) {
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.employment_start_date\\.month]`
    )
      .clear()
      .type(options.employment_start_date.mo)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.employment_start_date\\.day]`
    )
      .clear()
      .type(options.employment_start_date.day)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.employment_start_date\\.year]`
    )
      .clear()
      .type(options.employment_start_date.yr)
  }

  if (options.employment_last_date) {
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.employment_last_date\\.month]`
    )
      .clear()
      .type(options.employment_last_date.mo)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.employment_last_date\\.day]`
    )
      .clear()
      .type(options.employment_last_date.day)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.employment_last_date\\.year]`
    )
      .clear()
      .type(options.employment_last_date.yr)
  }

  if (options.expect_to_be_recalled !== undefined) {
    cy.get(
      `input[id=employers\\[${employerIndex}\\]\\.expect_to_be_recalled\\.${
        options.expect_to_be_recalled ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
}

export default fillChangeInEmployment
