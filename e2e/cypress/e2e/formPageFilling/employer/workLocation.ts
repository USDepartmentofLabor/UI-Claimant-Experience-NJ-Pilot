import { toYesOrNo } from '../../utils/toYesOrNo'

export const fillWorkLocationSection = (options) => {
  const {
    worked_at_employer_address,
    alternate_physical_work_address: { city, state, zipcode },
    is_employer_phone_accurate,
    work_location_phone,
  } = options

  cy.get(
    `input[id=worked_at_employer_address\\.${toYesOrNo(
      worked_at_employer_address
    )}]`
  )
    .parent()
    .click()

  cy.get(`[name=alternate_physical_work_address\\.city`)
    .should('be.visible')
    .clear()
    .type(city)

  cy.get(`[name=alternate_physical_work_address\\.state]`).select(state)

  cy.get(`[name=alternate_physical_work_address\\.zipcode`)
    .should('be.visible')
    .clear()
    .type(zipcode)

  cy.get(
    `input[id=is_employer_phone_accurate\\.${toYesOrNo(
      is_employer_phone_accurate
    )}]`
  )
    .parent()
    .click()

  cy.get(`[name=work_location_phone\\.number`)
    .should('be.visible')
    .clear()
    .type(work_location_phone)
}

export default fillWorkLocationSection
