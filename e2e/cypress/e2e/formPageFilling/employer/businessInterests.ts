import { toYesOrNo } from '../../utils/toYesOrNo'

type BusinessInterestsOptions = {
  self_employed?: boolean
  is_owner?: boolean
  corporate_officer_or_stock_ownership?: boolean
  employer_is_sole_proprietorship?: boolean
  related_to_owner_or_child_of_owner_under_18?: string
}

export const fillBusinessInterests = (
  employerIndex: string,
  options?: BusinessInterestsOptions
) => {
  const baseName = `employers\\[${employerIndex}\\]`

  const {
    self_employed = false,
    is_owner = false,
    corporate_officer_or_stock_ownership = false,
    employer_is_sole_proprietorship = false,
    related_to_owner_or_child_of_owner_under_18 = 'child',
  } = options || {}

  cy.get(`input[id=${baseName}\\.self_employed\\.${toYesOrNo(self_employed)}]`)
    .parent()
    .click()

  cy.get(`input[id=${baseName}\\.is_owner\\.${toYesOrNo(is_owner)}]`)
    .parent()
    .click()

  cy.get(
    `input[id=${baseName}\\.corporate_officer_or_stock_ownership\\.${toYesOrNo(
      corporate_officer_or_stock_ownership
    )}]`
  )
    .parent()
    .click()

  cy.get(
    `input[id=${baseName}\\.employer_is_sole_proprietorship\\.${toYesOrNo(
      employer_is_sole_proprietorship
    )}]`
  )
    .parent()
    .click()

  cy.get(
    `input[id=${baseName}\\.related_to_owner_or_child_of_owner_under_18\\.${related_to_owner_or_child_of_owner_under_18}]`
  )
    .parent()
    .click()
}
