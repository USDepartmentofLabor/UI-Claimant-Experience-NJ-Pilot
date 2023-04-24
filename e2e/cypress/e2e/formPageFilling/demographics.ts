const fillDemographicsFields = (demographic) => {
  const { sex, ethnicity, races } = demographic
  cy.get(`input[id=sex\\.${sex}]`).parent().click()
  cy.get(`input[id=ethnicity\\.${ethnicity}]`).parent().click()

  cy.get(`input[id=race\\[0\\]\\.${races[0]}]`).parent().click()

  cy.get('[name=education_level]').select(demographic.education_level)
}

export default fillDemographicsFields
