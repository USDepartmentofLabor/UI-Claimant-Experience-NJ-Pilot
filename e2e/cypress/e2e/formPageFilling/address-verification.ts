const fillAddressVerificationFields = (addressText: string) => {
  // The address verification API doesn't work when ran locally within a GitHub Action,
  // so we just click Next once the page has fully loaded, indicated by the presence of the address:
  cy.contains(addressText).should('be.visible')
}

export default fillAddressVerificationFields
