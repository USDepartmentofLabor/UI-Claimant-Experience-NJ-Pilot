// This is going to need big changes when the backend is integrated well
const fillRecentEmployersFields = () => {
  cy.get('input[id=employers\\[0\\]\\.is_employer\\.yes').parent().click()
  cy.get('input[id=employers\\[1\\]\\.is_employer\\.no').parent().click()
  cy.get('input[id=employers\\[2\\]\\.is_employer\\.no').parent().click()
}
export default fillRecentEmployersFields
