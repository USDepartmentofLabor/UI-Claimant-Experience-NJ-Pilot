import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { GridContainer } from '@trussworks/react-uswds'
import type { AppProps } from 'next/app'
import { appWithTranslation, SSRConfig } from 'next-i18next'
import { LiveAnnouncer } from 'react-aria-live'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { NextPage } from 'next'
import { ReactNode, useState } from 'react'
import { ScreenerInput, SsnInput } from 'types/claimantInput'
import { IntakeAppContext } from 'contexts/IntakeAppContext'

import 'i18n/i18n'
import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout'

import 'styles/styles.scss'
import { ActiveSessionHandler } from 'components/ActiveSessionHandler/ActiveSessionHandler'
import { SessionManager } from 'components/SessionManager/SessionManager'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactNode) => ReactNode
}

type CustomPageProps = SSRConfig & { session: Session }

type CustomAppProps = AppProps<CustomPageProps> & {
  Component: NextPageWithLayout
}

function ClaimApp({
  Component,
  pageProps: { session, ...pageProps },
}: CustomAppProps) {
  const [screenerInput, setScreenerInput] = useState<ScreenerInput | undefined>(
    undefined
  )
  const [ssnInput, setSsn] = useState<SsnInput | undefined>(undefined)
  const getLayout = Component.getLayout ?? ((page) => page)
  const page = <Component {...pageProps} />

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

  return (
    <SessionProvider session={session}>
      <ActiveSessionHandler>
        <QueryClientProvider client={queryClient}>
          <LiveAnnouncer>
            <ReactQueryDevtools initialIsOpen={false} />
            <IntakeAppContext.Provider
              value={{
                screenerInput,
                setScreenerInput,
                ssnInput,
                setSsn,
              }}
            >
              <DefaultLayout>
                <SessionManager forceOpen={false}></SessionManager>
                <GridContainer className="margin-top-2">
                  {getLayout(page)}
                </GridContainer>
              </DefaultLayout>
            </IntakeAppContext.Provider>
          </LiveAnnouncer>
        </QueryClientProvider>
      </ActiveSessionHandler>
    </SessionProvider>
  )
}

export default appWithTranslation<CustomAppProps>(ClaimApp)
