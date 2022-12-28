import { NextPublicAppEnv } from './environments'

export const CLAIM_FORM_BASE_ROUTE = '/claim'
export const makeClaimFormRoute = (page: string) =>
  `${CLAIM_FORM_BASE_ROUTE}/${page}`
export const ExternalRoutes = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV as NextPublicAppEnv
  if (env === 'production') {
    return {
      UPDATE_PAYMENT_INFO:
        'https://uiclaim.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
    }
  } else if (env === 'test') {
    return {
      UPDATE_PAYMENT_INFO:
        'https://securest.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
    }
  } else {
    return {
      UPDATE_PAYMENT_INFO:
        'https://stclaimproxy.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
    }
  }
}

export const Routes = {
  HOME: '/',
  SCREENER: '/screener',
  SCREENER_REDIRECT: '/screener-redirect',
  PRIVACY: '/privacy',
  SSN: '/ssn',
  UPDATE_PAYMENT_INFO: ExternalRoutes().UPDATE_PAYMENT_INFO,

  // Claim Form
  CLAIM: {
    PREQUAL: makeClaimFormRoute('prequal'),
    PERSONAL: makeClaimFormRoute('personal'),
    CONTACT: makeClaimFormRoute('contact'),
    DEMOGRAPHICS: makeClaimFormRoute('demographics'),
    IDENTITY: makeClaimFormRoute('identity'),
    RECENT_EMPLOYERS: makeClaimFormRoute('recent-employers'),
    EDIT_EMPLOYER: makeClaimFormRoute('edit-employer'),
    EMPLOYER_REVIEW: makeClaimFormRoute('employer-review'),
    OCCUPATION: makeClaimFormRoute('occupation'),
    EDUCATION_VOCATIONAL_REHAB: makeClaimFormRoute('education-and-training'),
    UNION: makeClaimFormRoute('union'),
    DISABILITY: makeClaimFormRoute('disability'),
    PAYMENT: makeClaimFormRoute('payment'),
    REVIEW: makeClaimFormRoute('review'),
  },
}
