export {}

describe('HTTP security headers', () => {
  it('returns expected HTTP security headers for the NextJS app', () => {
    cy.request('/').then((resp) => {
      expect(resp.headers).to.include({
        'x-frame-options': 'DENY',
        'x-xss-protection': '1; mode=block',
        'x-content-type-options': 'nosniff',
        'strict-transport-security': 'max-age=300; includeSubDomains',
        'content-security-policy': "frame-ancestors 'none'",
      })
    })
  })
})
