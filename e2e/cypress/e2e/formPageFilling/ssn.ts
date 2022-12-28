const fillSsnField = (options) => {
  cy.get('input[id="ssn"]').type(options.ssn)
}

export default fillSsnField
