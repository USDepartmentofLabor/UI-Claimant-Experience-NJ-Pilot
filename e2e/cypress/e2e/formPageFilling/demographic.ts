const fillDemographicFields = (demographic) => {
  const { sex, ethnicity, races } = demographic
  cy.get(`input[id=sex\\.${sex}]`).parent().click()
  cy.get(`input[id=ethnicity\\.${ethnicity}]`).parent().click()

  races.forEach((race) => {
    cy.get(`input[id=race\\.${race}]`).parent().click()
  })
}

export default fillDemographicFields
