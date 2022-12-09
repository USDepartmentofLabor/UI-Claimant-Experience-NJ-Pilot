import { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { SideNav } from '@trussworks/react-uswds'
import {
  PageDefinition,
  pageDefinitions,
} from 'constants/pages/pageDefinitions'
import { useClaimProgress } from 'hooks/useClaimProgress'

type ClaimFormSideNavProps = {
  className?: string
  pageDefinition: PageDefinition
}

export const ClaimFormSideNav = ({
  className, // TODO: It's always the same, just set it statically
  pageDefinition, // TODO: Just need the index, pass that in instead of the definition
}: ClaimFormSideNavProps) => {
  const { push } = useRouter()

  const currentPageIndex = pageDefinitions.indexOf(pageDefinition)
  if (currentPageIndex === -1) {
    throw new Error('Page not found')
  }

  const { continuePath } = useClaimProgress()
  const continuePageIndex = pageDefinitions.findIndex(
    (p) => p.path === continuePath
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

  const handleClickLink = async (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    await push(event.currentTarget.href)
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
