import { Button, Table } from '@trussworks/react-uswds'
import { WhoAmI } from 'types/claimantInput'
import { SignOut } from 'components/SignOut/SignOut'
import serverHttpClient from 'utils/http/serverHttpClient'
import { APIResponseType } from 'types/ResponseTypes'
import { GoToClaimFormButton } from 'components/GoToClaimFormButton/GoToClaimFormButton'
import { useSession } from 'next-auth/react'
import { ExternalWebsiteButton } from '../../form/ClaimFormButtons/ExternalWebsiteButton/ExternalWebsiteButton'

export type devHomeProps = {
  setClaimStatus: any
}

export const DevHome = ({ setClaimStatus }: devHomeProps) => {
  const session = useSession()
  const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production'
  const renderNoClaimPage = () => setClaimStatus('noCurrentClaim')

  return (
    <>
      <div className="margin-bottom-1">
        <h3>Signed in as:</h3>
        <Table>
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
        <ExternalWebsiteButton option={'payment'} />
      </div>
      <div className="margin-bottom-1">
        <ExternalWebsiteButton option={'contact'} />
      </div>
      <div>
        <ExternalWebsiteButton option={'tax'} />
      </div>
    </>
  )
}
