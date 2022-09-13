import { GridContainer } from '@trussworks/react-uswds'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { LiveAnnouncer } from 'react-aria-live'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import 'i18n/i18n'
import { ClaimForm } from 'components/layouts/ClaimForm/ClaimForm'
import { CLAIM_FORM_BASE_ROUTE } from 'constants/routes'
import { NewJerseyBanner } from 'components/NewJerseyBanner/NewJerseyBanner'

import 'styles/styles.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const page = <Component {...pageProps} />
  const currentPath = router.pathname

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        // Prevent re-queries on page focus
        refetchOnWindowFocus: false,
        // Cache queries up to five minutes by default
        cacheTime: 1000 * 5 * 60,
        // Queries are immediately stale. Can change on a per-query basis.
        staleTime: 0,
      },
    },
  })
  // TODO: Use Layout pattern again for things like claim form pages
  //       This is fine for now because we only have one condition to render
  //       a layout for, but this is not a good long term solution

  return (
    <QueryClientProvider client={queryClient}>
      <LiveAnnouncer>
        <NewJerseyBanner />
        <ReactQueryDevtools initialIsOpen={false} />
        <GridContainer>
          {currentPath.startsWith(`${CLAIM_FORM_BASE_ROUTE}/`) ? (
            <ClaimForm>{page}</ClaimForm>
          ) : (
            page
          )}
        </GridContainer>
      </LiveAnnouncer>
    </QueryClientProvider>
  )
}

export default appWithTranslation(MyApp)
