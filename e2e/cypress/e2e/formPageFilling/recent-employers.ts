// This is going to need big changes when the backend is integrated well
const fillRecentEmployersFields = () => {
  cy.get(
    'input[id=recent_employers\\[0\\]\\.worked_for_imported_employer_in_last_18mo\\.yes'
  )
    .parent()
    .click()
  cy.get(
    'input[id=recent_employers\\[1\\]\\.worked_for_imported_employer_in_last_18mo\\.no'
  )
    .parent()
    .click()
  cy.get(
    'input[id=recent_employers\\[2\\]\\.worked_for_imported_employer_in_last_18mo\\.no'
  )
    .parent()
    .click()
}
export default fillRecentEmployersFields
