import 'styles/globals.css'
import 'styles/styles.scss'
import type { AppProps } from 'next/app'
import 'i18n/i18n'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { ClaimForm } from 'components/layouts/ClaimForm/ClaimForm'
import { CLAIM_FORM_BASE_ROUTE } from 'constants/routes'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  const page = <Component {...pageProps} />

  const currentPath = router.pathname
  if (currentPath.startsWith(`${CLAIM_FORM_BASE_ROUTE}/`)) {
    return <ClaimForm>{page}</ClaimForm>
  }

  return page
}

export default appWithTranslation(MyApp)
