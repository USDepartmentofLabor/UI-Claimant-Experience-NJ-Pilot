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
      TAX_DOCUMENTS:
        'https://uiclaim.dol.state.nj.us/njsuccess/html/web1099Home.htm',
      UPDATE_CONTACT_INFO:
        'https://uiclaim.dol.state.nj.us/njsuccess/html/updateAddressHome.htm',
    }
  } else if (env === 'test') {
    return {
      UPDATE_PAYMENT_INFO:
        'https://securest.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
      TAX_DOCUMENTS:
        'https://securest.dol.state.nj.us/njsuccess/html/web1099Home.htm',
      UPDATE_CONTACT_INFO:
        'https://securest.dol.state.nj.us/njsuccess/html/updateAddressHome.htm',
    }
  } else {
    return {
      UPDATE_PAYMENT_INFO:
        'https://stclaimproxy.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
      TAX_DOCUMENTS:
        'https://stclaimproxy.dol.state.nj.us/njsuccess/html/web1099Home.htm',
      UPDATE_CONTACT_INFO:
        'https://stclaimproxy.dol.state.nj.us/njsuccess/html/updateAddressHome.htm',
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
  TAX_DOCUMENTS: ExternalRoutes().TAX_DOCUMENTS,
  UPDATE_CONTACT_INFO: ExternalRoutes().UPDATE_CONTACT_INFO,

  // Claim Form
  CLAIM: {
    PREQUAL: makeClaimFormRoute('prequal'),
    PERSONAL: makeClaimFormRoute('personal'),
    ADDRESS_VERIFICATION: makeClaimFormRoute('address-verification'),
    CONTACT: makeClaimFormRoute('contact'),
    DEMOGRAPHICS: makeClaimFormRoute('demographics'),
    IDENTITY: makeClaimFormRoute('identity'),
    RECENT_EMPLOYERS: makeClaimFormRoute('recent-employers'),
    EDIT_EMPLOYER: makeClaimFormRoute('edit-employer'),
    REVIEW_EMPLOYERS: makeClaimFormRoute('review-employers'),
    OCCUPATION: makeClaimFormRoute('occupation'),
    EDUCATION_VOCATIONAL_REHAB: makeClaimFormRoute('education-and-training'),
    UNION: makeClaimFormRoute('union'),
    DISABILITY: makeClaimFormRoute('disability'),
    PAYMENT: makeClaimFormRoute('payment'),
    REVIEW: makeClaimFormRoute('review'),
    SUCCESS: makeClaimFormRoute('beta-success'),
  },
}
