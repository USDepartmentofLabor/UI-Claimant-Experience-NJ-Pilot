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
  has_definite_recall_date?: boolean
  definite_recall_date?: dateField
  is_seasonal_work?: boolean
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
  if (options.has_definite_recall_date !== undefined) {
    cy.get(
      `input[id=employers\\[${employerIndex}\\]\\.definite_recall\\.${
        options.expect_to_be_recalled ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
  if (options.has_definite_recall_date !== undefined) {
    cy.get(
      `input[id=employers\\[${employerIndex}\\]\\.definite_recall\\.${
        options.has_definite_recall_date ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
  if (options.definite_recall_date !== undefined) {
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.definite_recall_date\\.month]`
    )
      .clear()
      .type(options.definite_recall_date.mo)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.definite_recall_date\\.day]`
    )
      .clear()
      .type(options.definite_recall_date.day)
    cy.get(
      `input[name=employers\\[${employerIndex}\\]\\.definite_recall_date\\.year]`
    )
      .clear()
      .type(options.definite_recall_date.yr)
  }
  if (options.is_seasonal_work !== undefined) {
    cy.get(
      `input[id=employers\\[${employerIndex}\\]\\.is_seasonal_work\\.${
        options.is_seasonal_work ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
}

export default fillChangeInEmployment
