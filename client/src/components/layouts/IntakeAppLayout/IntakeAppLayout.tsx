import { ReactNode } from 'react'
import { PageHeading } from 'components/form/ClaimFormHeading/PageHeading'

import Head from 'next/head'

type IntakeAppProps = {
  heading: ReactNode
  children: ReactNode
}

export const IntakeAppLayout = ({ heading, children }: IntakeAppProps) => {
  return (
    <>
      <Head>
        <title>{heading}</title>
      </Head>
      <div className="grid-row grid-gap">
        <main
          className="maxw-tablet margin-x-auto desktop:margin-0 desktop:grid-col-6"
          id="main-content"
        >
          <PageHeading aria-label={`${heading}`}>{heading}</PageHeading>
          {children}
        </main>
      </div>
    </>
  )
}
