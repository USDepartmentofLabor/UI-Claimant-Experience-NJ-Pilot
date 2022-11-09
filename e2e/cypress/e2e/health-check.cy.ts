export {}

describe('The API Health Check', () => {
  it('passes health check', () => {
    cy.request(
      `${Cypress.env('SERVER_BASE_URL')}/intake-api/actuator/health`
    ).then((resp) => {
      expect(resp.status).to.eq(200)
    })
  })
})
