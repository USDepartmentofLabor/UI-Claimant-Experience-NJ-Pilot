export {}

describe('The API Health Check', () => {
  it('passes health check', () => {
    cy.request('http://localhost:8080/intake-api/actuator/health').then(
      (resp) => {
        expect(resp.status).to.eq(200)
      }
    )
  })
})
