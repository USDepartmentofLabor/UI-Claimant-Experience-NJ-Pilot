import { NextPublicAppEnv } from './environments'

export const CLAIM_FORM_BASE_ROUTE = '/claim'
export const makeClaimFormRoute = (page: string) =>
  `${CLAIM_FORM_BASE_ROUTE}/${page}`
export const ExternalRoutes = () => {
  const env = process.env.NEXT_PUBLIC_APP_ENV as NextPublicAppEnv
  const allEnvs = {
    CERTIFY: 'https://lwdlba.state.nj.us/CertQueueMini/employerVerifyForm.htm',
    HOW_TO_CERTIFY:
      'https://nj.gov/labor/myunemployment/before/about/howtoapply/howtocertify.shtml',
    ID_ME_VERIFY: 'https://hosted-pages.id.me/njdolverify',
    ID_ME_DOCUMENT_TYPES:
      'https://help.id.me/hc/en-us/articles/360017833054-Primary-and-secondary-identification-documents',
    ID_ME_PROCESS:
      'https://help.id.me/hc/en-us/articles/1500005127662-Verifying-for-New-Jersey-DOL',
  }

  if (env === 'production') {
    return {
      ...allEnvs,
      UPDATE_PAYMENT_INFO:
        'https://uiclaim.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
      TAX_DOCUMENTS:
        'https://uiclaim.dol.state.nj.us/njsuccess/html/web1099Home.htm',
      UPDATE_CONTACT_INFO:
        'https://uiclaim.dol.state.nj.us/njsuccess/html/updateAddressHome.htm',
    }
  } else if (env === 'test') {
    return {
      ...allEnvs,
      UPDATE_PAYMENT_INFO:
        'https://securest.dol.state.nj.us/njsuccess/html/updateDirectDepositHome.htm',
      TAX_DOCUMENTS:
        'https://securest.dol.state.nj.us/njsuccess/html/web1099Home.htm',
      UPDATE_CONTACT_INFO:
        'https://securest.dol.state.nj.us/njsuccess/html/updateAddressHome.htm',
    }
  } else {
    return {
      ...allEnvs,
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

  CERTIFY: ExternalRoutes().CERTIFY,
  HOW_TO_CERTIFY: ExternalRoutes().HOW_TO_CERTIFY,
  ID_ME_DOCUMENT_TYPES: ExternalRoutes().ID_ME_DOCUMENT_TYPES,
  ID_ME_PROCESS: ExternalRoutes().ID_ME_PROCESS,
  ID_ME_VERIFY: ExternalRoutes().ID_ME_VERIFY,
  UPDATE_PAYMENT_INFO: ExternalRoutes().UPDATE_PAYMENT_INFO,
  TAX_DOCUMENTS: ExternalRoutes().TAX_DOCUMENTS,
  UPDATE_CONTACT_INFO: ExternalRoutes().UPDATE_CONTACT_INFO,

  // Claim Form
  CLAIM: {
    PREQUAL: makeClaimFormRoute('prequal'),
    PERSONAL: makeClaimFormRoute('personal'),
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
