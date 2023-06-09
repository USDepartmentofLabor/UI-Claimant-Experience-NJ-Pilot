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
    TEMPORARY_DISABILITY_INSURANCE:
      'https://nj.gov/labor/myleavebenefits/worker/tdi/',
    DOL_UNEMPLOYMENT_INFO:
      'https://www.dol.gov/general/topic/unemployment-insurance/',
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
      LEGACY_APPLICATION:
        'https://secure.dol.state.nj.us/sso/XUI/#login/&realm=ui&goto=https%3A%2F%2Fclaimproxy.dol.state.nj.us%3A443%2Fnjsuccess',
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
      LEGACY_APPLICATION: 'https://securest.dol.state.nj.us/njsuccess',
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
      LEGACY_APPLICATION: 'https://stclaimproxy.dol.state.nj.us/njsuccess',
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
  LEGACY_APPLICATION: ExternalRoutes().LEGACY_APPLICATION,
  UPDATE_PAYMENT_INFO: ExternalRoutes().UPDATE_PAYMENT_INFO,
  TAX_DOCUMENTS: ExternalRoutes().TAX_DOCUMENTS,
  TEMPORARY_DISABILITY_INSURANCE:
    ExternalRoutes().TEMPORARY_DISABILITY_INSURANCE,
  UPDATE_CONTACT_INFO: ExternalRoutes().UPDATE_CONTACT_INFO,
  DOL_UNEMPLOYMENT_INFO: ExternalRoutes().DOL_UNEMPLOYMENT_INFO,

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
