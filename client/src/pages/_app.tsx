import 'styles/styles.scss'
import type { AppProps } from 'next/app'
import 'i18n/i18n'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ClaimForm } from 'components/layouts/ClaimForm/ClaimForm'
import { CLAIM_FORM_BASE_ROUTE } from 'constants/routes'
import { LiveAnnouncer } from 'react-aria-live'
import { NewJerseyBanner } from 'components/NewJerseyBanner/NewJerseyBanner'
import { GridContainer } from '@trussworks/react-uswds'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const page = <Component {...pageProps} />
  const currentPath = router.pathname

  // TODO: Use Layout pattern again for things like claim form pages
  //       This is fine for now because we only have one condition to render
  //       a layout for, but this is not a good long term solution

  return (
    <LiveAnnouncer>
      <NewJerseyBanner />
      <GridContainer>
        {currentPath.startsWith(`${CLAIM_FORM_BASE_ROUTE}/`) ? (
          <ClaimForm>{page}</ClaimForm>
        ) : (
          page
        )}
      </GridContainer>
    </LiveAnnouncer>
  )
}

export default appWithTranslation(MyApp)
