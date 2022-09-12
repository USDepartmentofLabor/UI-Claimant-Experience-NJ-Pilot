import React from 'react'
import { useRouter } from 'next/router'
import { SideNav } from '@trussworks/react-uswds'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { useFormikContext } from 'formik'
import { ClaimantInput } from 'types/claimantInput'
import { useClaimProgress } from 'hooks/useClaimProgress'
import { Routes } from 'constants/routes'

type ClaimFormSideNavProps = {
  className?: string
}

export const ClaimFormSideNav = ({ className }: ClaimFormSideNavProps) => {
  //TODO: Once backend DB has been created uncomment/implement stateful claim progress
  //const { data: partialClaimResponse } = useGetPartialClaim();
  const { values, submitCount, setFormikState } =
    useFormikContext<ClaimantInput>()
  const { pathname, push } = useRouter()

  const currentPageIndex = pageDefinitions.findIndex((p) => p.path === pathname)
  if (currentPageIndex === -1) {
    throw new Error('Page not found')
  }

  const { continuePath } = useClaimProgress(values, submitCount)
  const continuePage = continuePath.replace(Routes.HOME, '')

  const continuePageIndex = pageDefinitions.findIndex(
    (p) => p.path === continuePage
  )

  const getCompletionStatus = (index: number) => {
    if (index === continuePageIndex) return 'current'
    if (index < continuePageIndex) return 'complete'
    return undefined
  }
  const getStatus = (index: number) => {
    if (index === currentPageIndex) return 'current'
    if (index < currentPageIndex) return 'complete'
    return undefined
  }

  const handleClickLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    push(event.currentTarget.href).then(() => {
      setFormikState((prevState) => ({
        ...prevState,
        submitCount: 0,
      }))
    })
  }

  const appItems = pageDefinitions.map((page, i) => {
    const heading = page.heading
    const path = page.path
    const status = getStatus(i)
    const completionStatus = getCompletionStatus(i)
    return completionStatus === undefined ? (
      <>
        <span className="nav-future">{heading}</span>
        <span className="screen-reader-only">, not completed</span>
      </>
    ) : (
      <a
        href={path}
        key={path}
        aria-current={status === 'current' ? 'step' : 'false'}
        className={status === 'current' ? 'usa-current' : ''}
        onClick={handleClickLink}
      >
        {heading}
        {completionStatus !== 'complete' || (
          <span className="screen-reader-only">, completed</span>
        )}
      </a>
    )
  })

  return (
    <nav aria-labelledby="Side Navigation" className={className}>
      <SideNav items={appItems} />
    </nav>
  )
}
