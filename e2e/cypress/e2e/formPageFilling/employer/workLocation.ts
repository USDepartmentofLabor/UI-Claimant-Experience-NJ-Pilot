import { toYesOrNo } from '../../utils/toYesOrNo'

const fillWorkLocationSection = (employerIndex, options) => {
  const baseName = `employers\\[${employerIndex}\\]`
  const {
    worked_at_employer_address,
    alternate_physical_work_address: { city, state, zipcode },
    is_employer_phone_accurate,
    work_location_phone,
  } = options

  cy.get(
    `input[id=${baseName}\\.worked_at_employer_address\\.${toYesOrNo(
      worked_at_employer_address
    )}]`
  )
    .parent()
    .click()

  cy.get(`[name=${baseName}\\.alternate_physical_work_address\\.city`)
    .should('be.visible')
    .clear()
    .type(city)

  cy.get(`[name=${baseName}\\.alternate_physical_work_address\\.state]`).select(
    state
  )

  cy.get(`[name=${baseName}\\.alternate_physical_work_address\\.zipcode`)
    .should('be.visible')
    .clear()
    .type(zipcode)

  cy.get(
    `input[id=${baseName}\\.is_employer_phone_accurate\\.${toYesOrNo(
      is_employer_phone_accurate
    )}]`
  )
    .parent()
    .click()

  cy.get(`[name=${baseName}\\.work_location_phone\\.number`)
    .should('be.visible')
    .clear()
    .type(work_location_phone)
}

export default fillWorkLocationSection
