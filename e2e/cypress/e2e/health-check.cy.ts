export {}

describe('The NextJS Client Health Check', () => {
  it('passes client health check', () => {
    cy.request(`${Cypress.env('SERVER_BASE_URL')}/api/health`).then((resp) => {
      expect(resp.status).to.eq(200)
    })
  })
})

describe('The Spring Boot Server Health Check', () => {
  it('passes server health check', () => {
    cy.request(
      `${Cypress.env('SERVER_BASE_URL')}/intake-api/actuator/health`
    ).then((resp) => {
      expect(resp.status).to.eq(200)
    })
  })
})
