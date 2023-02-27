import { MouseEvent } from 'react'
import { useRouter } from 'next/router'
import { Accordion, SideNav } from '@trussworks/react-uswds'
import { AccordionItemProps } from '@trussworks/react-uswds/lib/components/Accordion/Accordion'
import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { useClaimProgress } from 'hooks/useClaimProgress'
import styles from './ClaimFormSideNav.module.scss'

type ClaimFormSideNavProps = {
  index: number
}

export const ClaimFormSideNav = ({ index }: ClaimFormSideNavProps) => {
  const { push } = useRouter()

  const currentPageIndex = index
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
        <span className={styles.nav_future}>{heading}</span>
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

  const sideNav = <SideNav items={appItems} />
  const sidenav_accordion: AccordionItemProps[] = [
    {
      title: 'Form steps',
      content: sideNav,
      expanded: false,
      id: 'sidenav_accordion',
      headingLevel: 'h1',
    },
  ]

  return (
    <>
      <Accordion
        bordered={true}
        items={sidenav_accordion}
        className={styles.sidenav_accordion_outer}
      />
      <nav
        aria-label="Form pages"
        className={`desktop:grid-col-3 desktop:margin-top-4 ${styles.sidenav}`}
      >
        {sideNav}
      </nav>
    </>
  )
}
