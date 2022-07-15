const fillIdentityFields = (identity) => {
  cy.get('input[name=ssn]').should('be.visible').clear().type(identity.ssn)

  cy.get('input[name=birthdate\\.month]').clear().type(identity.birthdate.month)
  cy.get('input[name=birthdate\\.day]').clear().type(identity.birthdate.day)
  cy.get('input[name=birthdate\\.year]').clear().type(identity.birthdate.year)

  cy.get('input[name=state_credential\\.drivers_license_or_state_id_number]')
    .clear()
    .type(identity.drivers_license)

  cy.get('select[name=state_credential\\.issuer]').select(
    identity.state_license_issuer
  )

  if (identity.work_authorization.authorized_to_work) {
    cy.get('input[id=work_authorization\\.authorized_to_work\\.yes]')
      .parent()
      .click()

    cy.get('select[name=work_authorization\\.authorization_type').select(
      identity.work_authorization.authorization_type
    )
  } else {
    cy.get('input[id=work_authorization\\.authorized_to_work\\.no]')
      .parent()
      .click()

    cy.get(
      'textarea[name=work_authorization\\.not_authorized_to_work_explanation]'
    ).type(identity.not_authorized_to_work_explanation)
  }
}

export default fillIdentityFields
