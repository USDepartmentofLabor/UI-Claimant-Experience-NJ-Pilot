import { Button, Table } from '@trussworks/react-uswds'
import { WhoAmI } from 'types/claimantInput'
import { SignOut } from 'components/SignOut/SignOut'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'
import { Routes } from 'constants/routes'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { GoToClaimFormButton } from 'components/GoToClaimFormButton/GoToClaimFormButton'
import { useSession } from 'next-auth/react'
import { ExternalWebsiteButton } from '../../form/ClaimFormButtons/ExternalWebsiteButton/ExternalWebsiteButton'

export type devHomeProps = {
  setClaimStatus: any
}

export const DevHome = ({ setClaimStatus }: devHomeProps) => {
  const router = useRouter()
  const session = useSession()
  const { t } = useTranslation('home')
  const goToTaxDocumentsPage = () => router.push(Routes.TAX_DOCUMENTS)
  const goToUpdatePaymentForm = () => router.push(Routes.UPDATE_PAYMENT_INFO)
  const goToUpdateContactInfoForm = () =>
    router.push(Routes.UPDATE_CONTACT_INFO)
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
  const renderNoClaimPage = () => setClaimStatus('noCurrentClaim')

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
            {session.data &&
              Object.entries(session.data.whoAmI as WhoAmI).map(
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
        <GoToClaimFormButton />
      </div>
      <div className="margin-bottom-1">
        <Button
          type="button"
          onClick={renderNoClaimPage}
          data-testid="view-no-current-claim-page"
        >
          No Current Claim Page
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
      <div className="margin-bottom-1">
        <Button
          type="button"
          secondary
          onClick={goToTaxDocumentsPage}
          data-testid="go-to-tax-documents"
        >
          {t('tax_doc_button')}
        </Button>
        <div className="margin-bottom-1">
          <ExternalWebsiteButton option={'payment'} />
        </div>
        <div className="margin-bottom-1">
          <ExternalWebsiteButton option={'contact'} />
        </div>
        <div>
          <ExternalWebsiteButton option={'tax'} />
        </div>
      </div>
    </>
  )
}
