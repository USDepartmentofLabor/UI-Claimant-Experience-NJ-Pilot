const fillPersonalFields = (claimant, addresses) => {
  fillClaimantNameFields(claimant)
  fillAddressFields(addresses)
}

const fillClaimantNameFields = (claimant) => {
  cy.get('[name=claimant_name\\.first_name]').clear().type(claimant.first_name)
  claimant.middle_initial &&
    cy
      .get('[name=claimant_name\\.middle_initial]')
      .clear()
      .type(claimant.middle_initial)
  cy.get('[name=claimant_name\\.last_name]').clear().type(claimant.last_name)
  if (claimant.alternate_names) {
    cy.get('input[id=LOCAL_claimant_has_alternate_names\\.yes').parent().click()
    cy.get('[name=alternate_names\\.0\\.first_name]')
      .clear()
      .type(claimant.alternate_names[0].first_name)
    cy.get('[name=alternate_names\\.0\\.last_name]')
      .clear()
      .type(claimant.alternate_names[0].last_name)
  } else {
    cy.get('input[id=LOCAL_claimant_has_alternate_names\\.no').parent().click()
  }
}

const fillAddressFields = (addresses) => {
  cy.get('[name=residence_address\\.address1]')
    .clear()
    .type(addresses.residence_address.address1)
  cy.get('[name=residence_address\\.address2]')
    .clear()
    .type(addresses.residence_address.address2)
  cy.get('[name=residence_address\\.city]')
    .clear()
    .type(addresses.residence_address.city)
  cy.get('[name=residence_address\\.state]').select(
    addresses.residence_address.state
  )
  cy.get('[name=residence_address\\.zipcode]')
    .clear()
    .type(addresses.residence_address.zipcode, { force: true })
  if (!addresses.mailing_address) {
    cy.get('[name=LOCAL_mailing_address_same]').check({ force: true })
  } else {
    cy.get('[name=mailing_address\\.address1]')
      .clear()
      .type(addresses.mailing_address.address1)
    cy.get('[name=mailing_address\\.address2]')
      .clear()
      .type(addresses.mailing_address.address2)
    cy.get('[name=mailing_address\\.city]')
      .clear()
      .type(addresses.mailing_address.city)
    cy.get('[name=mailing_address\\.state]').select(
      addresses.mailing_address.state
    )
    cy.get('[name=mailing_address\\.zipcode]')
      .clear()
      .type(addresses.mailing_address.zipcode, { force: true })
  }
}

export default fillPersonalFields
