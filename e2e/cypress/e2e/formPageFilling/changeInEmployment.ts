type dateField = {
  mo: string
  day: string
  yr: string
}
type ChangeInEmploymentOptions = {
  separation_circumstance: string
  separation_circumstance_details?: string
  expect_to_be_recalled?: boolean
  employment_start_date?: dateField
  employment_last_date?: dateField
  discharge_date?: dateField
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

  if (options.separation_circumstance_details) {
    cy.get(
      `textarea[name=employers\\[${employerIndex}\\]\\.separation_circumstance_details]`
    ).type(options.separation_circumstance_details)
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

  if (options.discharge_date) {
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.discharge_date\\.month]`
    )
      .clear()
      .type(options.discharge_date.mo)
    cy.get(`input[name=employers\\[${employerIndex}\\]\\.discharge_date\\.day]`)
      .clear()
      .type(options.discharge_date.day)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.discharge_date\\.year]`
    )
      .clear()
      .type(options.discharge_date.yr)
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
