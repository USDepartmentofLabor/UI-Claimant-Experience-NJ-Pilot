const fillReviewFields = () => {
  cy.get(`input[id="certify"]`).parent().click()
}

export default fillReviewFields
