import { toYesOrNo } from '../../utils/toYesOrNo'

export type AddressWithoutStreetInput = {
  city: string
  state: string
  zipcode: string
}

type WorkLocationOptions = {
  worked_at_employer_address?: boolean
  alternate_physical_work_address?: AddressWithoutStreetInput
  is_employer_phone_accurate?: boolean
  work_location_phone?: string
}

export const fillWorkLocationSection = (options: WorkLocationOptions = {}) => {
  const {
    worked_at_employer_address,
    is_employer_phone_accurate,
    alternate_physical_work_address,
    work_location_phone,
  } = options

  if (worked_at_employer_address !== undefined) {
    cy.get(
      `input[id=worked_at_employer_address\\.${toYesOrNo(
        worked_at_employer_address
      )}]`
    )
      .parent()
      .click()
  }

  if (alternate_physical_work_address) {
    const { city, state, zipcode } = alternate_physical_work_address

    if (city) {
      cy.get(`[name=alternate_physical_work_address\\.city`)
        .should('be.visible')
        .clear()
        .type(city)
    }
    if (state) {
      cy.get(`[name=alternate_physical_work_address\\.state]`).select(state)
    }
    if (zipcode) {
      cy.get(`[name=alternate_physical_work_address\\.zipcode`)
        .should('be.visible')
        .clear()
        .type(zipcode)
    }
  }

  if (is_employer_phone_accurate !== undefined) {
    cy.get(
      `input[id=is_employer_phone_accurate\\.${toYesOrNo(
        is_employer_phone_accurate
      )}]`
    )
      .parent()
      .click()
  }

  if (work_location_phone !== undefined) {
    cy.get(`[name=work_location_phone\\.number`)
      .should('be.visible')
      .clear()
      .type(work_location_phone)
  }
}

export default fillWorkLocationSection
