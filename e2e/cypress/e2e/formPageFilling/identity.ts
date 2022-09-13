const fillIdentityFields = (identity) => {
  cy.get('input[name=drivers_license_or_state_id_number]')
    .clear()
    .type(identity.drivers_license)

  if (identity.work_authorization.authorized_to_work) {
    cy.get('input[id=authorized_to_work\\.yes]').parent().click()

    cy.get('select[name=authorization_type').select(
      identity.work_authorization.authorization_type
    )
  } else {
    cy.get('input[id=authorized_to_work\\.no]').parent().click()

    cy.get('textarea[name=not_authorized_to_work_explanation]').type(
      identity.not_authorized_to_work_explanation
    )
  }
}

export default fillIdentityFields
