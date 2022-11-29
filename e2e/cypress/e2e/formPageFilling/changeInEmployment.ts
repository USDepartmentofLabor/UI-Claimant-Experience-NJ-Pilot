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
  hours_reduced_twenty_percent?: boolean
  reason_still_employed?: string
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
  if (options.reason_still_employed) {
    cy.get(
      `input[id=employers\\[${employerIndex}\\]\\.reason_still_employed\\.${options.reason_still_employed}]`
    ).click({ force: true })
  }
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
  if (options.hours_reduced_twenty_percent !== undefined) {
    cy.get(
      `input[id=employers\\[${employerIndex}\\]\\.hours_reduced_twenty_percent\\.${
        options.hours_reduced_twenty_percent ? 'yes' : 'no'
      }]`
    ).click({ force: true })
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
