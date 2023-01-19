const fillSsnField = (options) => {
  cy.findByLabelText(/social security number/i).type(options.ssn)
}

export default fillSsnField
