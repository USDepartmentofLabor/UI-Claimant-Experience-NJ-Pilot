import 'styles/globals.css'
import 'styles/styles.scss'
import type { AppProps } from 'next/app'
import 'i18n/i18n'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp