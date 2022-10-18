export const CLAIM_FORM_BASE_ROUTE = '/claim'
export const makeClaimFormRoute = (page: string) =>
  `${CLAIM_FORM_BASE_ROUTE}/${page}`

export const Routes = {
  HOME: '/',
  SCREENER: '/screener',
  PRIVACY: '/privacy',

  // Claim Form
  CLAIM: {
    PERSONAL: makeClaimFormRoute('personal'),
    CONTACT: makeClaimFormRoute('contact'),
    DEMOGRAPHICS: makeClaimFormRoute('demographics'),
    IDENTITY: makeClaimFormRoute('identity'),
    EMPLOYER: makeClaimFormRoute('employer'),
    EMPLOYER_REVIEW: makeClaimFormRoute('employer-review'),
    SELF_EMPLOYMENT: makeClaimFormRoute('self-employment'),
    OTHER_PAY: makeClaimFormRoute('other-pay'),
    OCCUPATION: makeClaimFormRoute('occupation'),
    EDUCATION_VOCATIONAL_REHAB: makeClaimFormRoute('education-and-training'),
    UNION: makeClaimFormRoute('union'),
    ABLE_AND_AVAILABLE: makeClaimFormRoute('able-and-available'),
    AVAILABILITY: makeClaimFormRoute('availability'),
    PAYMENT: makeClaimFormRoute('payment'),
    REVIEW: makeClaimFormRoute('review'),
  },
}
