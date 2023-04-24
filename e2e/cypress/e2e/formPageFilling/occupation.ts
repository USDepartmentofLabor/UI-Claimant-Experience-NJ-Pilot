const fillOccupationFields = (occupation) => {
  cy.get(`input[name=job_title]`).clear().type(occupation.job_title)
  cy.get(`textarea[name=job_description]`)
    .clear()
    .type(occupation.job_description)
}

export default fillOccupationFields
