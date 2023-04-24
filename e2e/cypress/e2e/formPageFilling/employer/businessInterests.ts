import { toYesOrNo } from '../../utils/toYesOrNo'

type BusinessInterestsOptions = {
  self_employed?: boolean
  is_owner?: boolean
  corporate_officer_or_stock_ownership?: boolean
  employer_is_sole_proprietorship?: string
  related_to_owner_or_child_of_owner_under_18?: string
}

export const fillBusinessInterests = (options?: BusinessInterestsOptions) => {
  const {
    self_employed,
    is_owner,
    corporate_officer_or_stock_ownership,
    employer_is_sole_proprietorship,
    related_to_owner_or_child_of_owner_under_18,
  } = options

  if (self_employed !== undefined) {
    cy.get(`input[id=self_employed\\.${toYesOrNo(self_employed)}]`)
      .parent()
      .click()
  }

  if (is_owner !== undefined) {
    cy.get(`input[id=is_owner\\.${toYesOrNo(is_owner)}]`)
      .parent()
      .click()
  }

  if (corporate_officer_or_stock_ownership !== undefined) {
    cy.get(
      `input[id=corporate_officer_or_stock_ownership\\.${toYesOrNo(
        corporate_officer_or_stock_ownership
      )}]`
    )
      .parent()
      .click()
  }

  if (employer_is_sole_proprietorship !== undefined) {
    cy.get(`input[id=employer_is_sole_proprietorship\\.yes]`).parent().click()
  }

  if (related_to_owner_or_child_of_owner_under_18 !== undefined) {
    cy.get(
      `input[id=related_to_owner_or_child_of_owner_under_18\\.${related_to_owner_or_child_of_owner_under_18}]`
    )
      .parent()
      .click()
  }
}
