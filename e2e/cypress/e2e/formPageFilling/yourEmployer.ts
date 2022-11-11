const fillYourEmployerFields = (employerIndex, is_full_time) => {
  cy.get(
    `input[id=employers\\[${employerIndex}\\]\\.is_full_time\\.${
      is_full_time ? 'yes' : 'no'
    }]`
  ).click({ force: true })
}

export default fillYourEmployerFields
