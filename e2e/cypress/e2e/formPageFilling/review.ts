const fillReviewFields = () => {
  cy.get(`input[id="certify"]`).scrollIntoView().parent().click()
}

export default fillReviewFields
