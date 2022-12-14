type YourEmployerOptions = {
  is_full_time?: boolean
}

export const fillYourEmployerFields = (options: YourEmployerOptions = {}) => {
  const is_full_time = options?.is_full_time
  cy.get(`input[id=is_full_time\\.${is_full_time ? 'yes' : 'no'}]`).click({
    force: true,
  })
}

export default fillYourEmployerFields
