// This is going to need big changes when the backend is integrated well
const fillRecentEmployersFields = () => {
  cy.get('input[id=employers\\[0\\]\\.isEmployer\\.yes').parent().click()
  cy.get('input[id=employers\\[1\\]\\.isEmployer\\.yes').parent().click()
  cy.get('input[id=employers\\[2\\]\\.isEmployer\\.no').parent().click()
}
export default fillRecentEmployersFields
