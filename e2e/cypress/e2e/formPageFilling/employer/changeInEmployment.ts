type dateField = {
  mo: string
  day: string
  yr: string
}
type ChangeInEmploymentOptions = {
  separation_circumstance?: string
  separation_circumstance_details?: string
  expect_to_be_recalled?: boolean
  employment_start_date?: dateField
  employment_last_date?: dateField
  hours_reduced_twenty_percent?: boolean
  reason_still_employed?: string
  discharge_date?: dateField
  has_definite_recall_date?: boolean
  definite_recall_date?: dateField
  is_seasonal_work?: boolean
}

export const fillChangeInEmployment = (options: ChangeInEmploymentOptions) => {
  if (options.separation_circumstance) {
    cy.get(
      `input[id=separation_circumstance\\.${options.separation_circumstance}`
    )
      .parent()
      .click()
  }
  if (options.reason_still_employed) {
    cy.get(`select[id=reason_still_employed]`).select(
      options.reason_still_employed
    )
  }

  if (options.separation_circumstance_details) {
    cy.get(`textarea[name=separation_circumstance_details]`)
      .clear()
      .type(options.separation_circumstance_details)
  }

  if (options.employment_start_date) {
    cy.get(`input[name=employment_start_date\\.month]`)
      .clear()
      .type(options.employment_start_date.mo)
    cy.get(`input[name=employment_start_date\\.day]`)
      .clear()
      .type(options.employment_start_date.day)
    cy.get(`input[name=employment_start_date\\.year]`)
      .clear()
      .type(options.employment_start_date.yr)
  }

  if (options.employment_last_date) {
    cy.get(`input[name=employment_last_date\\.month]`)
      .clear()
      .type(options.employment_last_date.mo)
    cy.get(`input[name=employment_last_date\\.day]`)
      .clear()
      .type(options.employment_last_date.day)
    cy.get(`input[name=employment_last_date\\.year]`)
      .clear()
      .type(options.employment_last_date.yr)
  }
  if (options.hours_reduced_twenty_percent !== undefined) {
    cy.get(
      `input[id=hours_reduced_twenty_percent\\.${
        options.hours_reduced_twenty_percent ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }

  if (options.discharge_date) {
    cy.get(`input[name=discharge_date\\.month]`)
      .clear()
      .type(options.discharge_date.mo)
    cy.get(`input[name=discharge_date\\.day]`)
      .clear()
      .type(options.discharge_date.day)
    cy.get(`input[name=discharge_date\\.year]`)
      .clear()
      .type(options.discharge_date.yr)
  }

  if (options.expect_to_be_recalled !== undefined) {
    cy.get(
      `input[id=expect_to_be_recalled\\.${
        options.expect_to_be_recalled ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
  if (options.has_definite_recall_date !== undefined) {
    cy.get(
      `input[id=definite_recall\\.${
        options.expect_to_be_recalled ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
  if (options.has_definite_recall_date !== undefined) {
    cy.get(
      `input[id=definite_recall\\.${
        options.has_definite_recall_date ? 'yes' : 'no'
      }]`
    ).click({ force: true })
  }
  if (options.definite_recall_date !== undefined) {
    cy.get(`input[name=definite_recall_date\\.month]`)
      .clear()
      .type(options.definite_recall_date.mo)
    cy.get(`input[name=definite_recall_date\\.day]`)
      .clear()
      .type(options.definite_recall_date.day)
    cy.get(`input[name=definite_recall_date\\.year]`)
      .clear()
      .type(options.definite_recall_date.yr)
  }
  if (options.is_seasonal_work !== undefined) {
    cy.get(
      `input[id=is_seasonal_work\\
      .${options.is_seasonal_work ? 'yes' : 'no'}]`
    ).click({ force: true })
  }
}

export default fillChangeInEmployment
