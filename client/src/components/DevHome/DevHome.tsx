import { Button, Table } from '@trussworks/react-uswds'
import { WhoAmI } from 'types/claimantInput'
import { SignOut } from 'components/SignOut/SignOut'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'
import { Routes } from 'constants/routes'
import { useRouter } from 'next/router'
import { useClaimProgress } from 'hooks/useClaimProgress'
import { useContext } from 'react'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import { useTranslation } from 'react-i18next'

export type devHomeProps = {
  session: any // TODO MRH typecast more specifically
  partialClaim: any // TODO MRH typecast more specifically
  hasInProgressClaim: boolean
}

export const DevHome = ({
  session,
  partialClaim,
  hasInProgressClaim,
}: devHomeProps) => {
  const router = useRouter()
  const { continuePath } = useClaimProgress()
  const { t } = useTranslation('home')
  const { ssnInput, screenerInput } = useContext(IntakeAppContext)
  const goToLastUnfinishedClaimFormPage = () => {
    // TODO: handle what to do if they have a completed claim
    let path
    if (partialClaim?.ssn === undefined && ssnInput?.ssn === undefined) {
      path = Routes.SSN
    } else if (
      partialClaim?.screener_current_country_us === undefined &&
      screenerInput === undefined
    ) {
      path = Routes.SCREENER
    } else {
      path = continuePath
    }
    router.push(path)
  }
  const goToTaxDocumentsPage = () => router.push(Routes.TAX_DOCUMENTS)
  const goToUpdatePaymentForm = () => router.push(Routes.UPDATE_PAYMENT_INFO)
  const goToUpdateContactInfoForm = () =>
    router.push(Routes.UPDATE_CONTACT_INFO)
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'

  return (
    <>
      <div className="margin-bottom-1">
        <h3>Signed in as:</h3>
        <Table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(session.data.whoAmI as WhoAmI).map(
              ([key, value], i) => (
                <tr key={`${i}-${key}-${value}`}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
      <div className="margin-bottom-1">
        <SignOut isNavLink={false} />
      </div>
      <div className="margin-bottom-1">
        <Button
          type="button"
          onClick={goToLastUnfinishedClaimFormPage}
          data-testid="go-to-claim-form"
        >
          {hasInProgressClaim
            ? t('continue_claim_button')
            : t('file_a_claim_button')}
        </Button>
      </div>
      {!isProd && (
        <div className="margin-bottom-1">
          <Button
            type="button"
            secondary
            onClick={() =>
              serverHttpClient
                .post<APIResponseType>('/partial-claim', {})
                .then(() => {
                  location.reload()
                })
            }
          >
            Reset claim (dev/test)
          </Button>
        </div>
      )}
      <div className="margin-bottom-1">
        <Button
          type="button"
          secondary
          onClick={goToUpdatePaymentForm}
          data-testid="go-to-update-payment"
        >
          Update payment info
        </Button>
      </div>
      <div className="margin-bottom-1">
        <Button
          type="button"
          secondary
          onClick={goToUpdateContactInfoForm}
          data-testid="go-to-update-contact-info"
        >
          {t('update_contact_info_button')}
        </Button>
      </div>
      <div>
        <Button
          type="button"
          secondary
          onClick={goToTaxDocumentsPage}
          data-testid="go-to-tax-documents"
        >
          {t('tax_doc_button')}
        </Button>
      </div>
    </>
  )
}
