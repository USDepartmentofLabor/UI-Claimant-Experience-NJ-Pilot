const fillIdentityFields = (identity) => {
  const {
    has_nj_issued_id,
    drivers_license_or_state_id_number,
    work_authorization,
  } = identity
  cy.get(`input[id=has_nj_issued_id\\.${has_nj_issued_id}]`).parent().click()
  cy.get(`[name=drivers_license_or_state_id_number]`)
    .should('be.visible')
    .clear()
    .type(drivers_license_or_state_id_number)
  cy.get(
    `input[id=authorization_type\\.${work_authorization.authorization_type}]`
  )
    .parent()
    .click()

  cy.get(`[name=employment_authorization_document_name\\.first_name]`)
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_document_name.first_name)
  cy.get(`[name=employment_authorization_document_name\\.middle_initial]`)
    .should('be.visible')
    .clear()
    .type(
      work_authorization.employment_authorization_document_name.middle_initial
    )
  cy.get(`[name=employment_authorization_document_name\\.last_name]`)
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_document_name.last_name)
  cy.get(`[name=employment_authorization_document_name\\.suffix]`).select(
    work_authorization.employment_authorization_document_name.suffix
  )

  cy.get(`[name=alien_registration_number]`)
    .should('be.visible')
    .clear()
    .type(work_authorization.alien_registration_number)
  cy.get(`[name=LOCAL_re_enter_alien_registration_number]`)
    .should('be.visible')
    .clear()
    .type(work_authorization.re_enter_alien_registration_number)
  cy.get(`[name=country_of_origin]`).select(
    work_authorization.country_of_origin
  )

  cy.get('[name=employment_authorization_start_date\\.month')
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_start_date.mo)
  cy.get('[name=employment_authorization_start_date\\.day')
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_start_date.day)
  cy.get('[name=employment_authorization_start_date\\.year')
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_start_date.yr)

  cy.get('[name=employment_authorization_end_date\\.month')
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_end_date.mo)
  cy.get('[name=employment_authorization_end_date\\.day')
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_end_date.day)
  cy.get('[name=employment_authorization_end_date\\.year')
    .should('be.visible')
    .clear()
    .type(work_authorization.employment_authorization_end_date.yr)
}

export default fillIdentityFields
