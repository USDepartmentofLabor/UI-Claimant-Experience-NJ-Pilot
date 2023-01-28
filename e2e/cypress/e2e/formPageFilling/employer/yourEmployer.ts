export type EmployerAddressInput = {
  address: string
  address2?: string
  address3?: string
  city: string
  state: string
  zipcode: string
}

type YourEmployerOptions = {
  employer_name?: string
  is_full_time?: boolean
  fein?: string
  employer_address?: EmployerAddressInput
  employer_phone?: string
}

export const fillYourEmployerFields = (options: YourEmployerOptions = {}) => {
  const {
    employer_name,
    is_full_time,
    fein,
    employer_address,
    employer_phone,
  } = options

  if (employer_name)
    cy.get('input[name=employer_name]').clear().type(employer_name)

  if (fein) cy.get('input[name=fein]').clear().type(fein)

  if (is_full_time !== undefined) {
    cy.get(`input[id=is_full_time\\.${is_full_time ? 'yes' : 'no'}]`).click({
      force: true,
    })
  }
  if (employer_address) {
    if (employer_address.address)
      cy.get(`input[name=employer_address\\.address`)
        .should('be.visible')
        .clear()
        .type(employer_address.address)
    if (employer_address.address2)
      cy.get(`input[name=employer_address\\.address2`)
        .clear()
        .type(employer_address.address2)
    if (employer_address.address3)
      cy.get(`input[name=employer_address\\.address3`)
        .clear()
        .type(employer_address.address3)
    if (employer_address.city)
      cy.get(`input[name=employer_address\\.city`)
        .clear()
        .type(employer_address.city)
    if (employer_address.state)
      cy.get(`[name=employer_address\\.state`)
        .select(employer_address.state)
        .blur()
    if (employer_address.zipcode)
      cy.get(`input[name=employer_address\\.zipcode`)
        .clear()
        .type(employer_address.zipcode)
  }

  if (employer_phone) {
    cy.get(`input[name=employer_phone\\.number`).clear().type(employer_phone)
  }
}

export default fillYourEmployerFields
