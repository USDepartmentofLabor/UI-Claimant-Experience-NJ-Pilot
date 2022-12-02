import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Header,
  NavDropDownButton,
  Menu,
  PrimaryNav,
  NavMenuButton,
  Title,
  Link,
} from '@trussworks/react-uswds'
import { useRouter } from 'next/router'
// import { pageDefinitions } from 'constants/pages/pageDefinitions'
import { Routes, CLAIM_FORM_BASE_ROUTE } from 'constants/routes'

export const NewJerseyHeader = () => {
  const { t } = useTranslation('common', { keyPrefix: 'header' })
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const onClick = (): void => setExpanded((prvExpanded) => !prvExpanded)
  const [isOpen, setIsOpen] = useState([false, false])
  const submitted = router?.query?.completed
  const menuItems = [
    <Link
      href={Routes.HOME}
      key="home"
      variant="nav"
      aria-current={router && router.asPath === Routes.HOME}
      className={router && router.asPath === Routes.HOME ? 'usa-current' : ''}
    >
      {t('home')}
    </Link>,
    submitted ? (
      <>
        <NavDropDownButton
          onToggle={(): void => {
            onToggle(0, setIsOpen)
          }}
          menuId="claimDropdown"
          isOpen={isOpen[0]}
          label={t('my_claim')}
          isCurrent={router && router.asPath.includes(CLAIM_FORM_BASE_ROUTE)}
        />
        <Menu
          key="claim"
          items={[
            // TODO: uncomment links when pages are added
            // <Link
            //   href="Routes.PAYMENTS"
            //   key="payments"
            //   aria-current={router.asPath === Routes.PAYMENTS}
            // >
            //   {t('payments')}
            // </Link>,
            // <Link
            //   href="Routes.CONTACT"
            //   key="contact"
            //   aria-current={router.asPath === Routes.CONTACT}
            // >
            //   {t('contact')}
            // </Link>,
            <Link
              href="https://nj.gov/labor/myunemployment/appeals/claimant/"
              key="appeal"
              variant="external"
            >
              {t('appeal')}
            </Link>,
          ]}
          data-testid="claimDropdown"
          isOpen={isOpen[0]}
          id="claimDropdown"
        />
      </>
    ) : (
      <Link
        key="claim"
        variant="nav"
        // TODO Figure out solution to why this line is making Storybook give errors
        // href={pageDefinitions[0].path}
        href={Routes.CLAIM.PREQUAL}
        aria-current={router && router.asPath.includes(CLAIM_FORM_BASE_ROUTE)}
        className={
          router && router.asPath.includes(CLAIM_FORM_BASE_ROUTE)
            ? 'usa-current'
            : ''
        }
      >
        {t('my_claim')}
      </Link>
    ),
    <Link
      href={Routes.PRIVACY}
      key="privacy"
      variant="nav"
      aria-current={router && router.asPath === Routes.PRIVACY}
      className={
        router && router.asPath === Routes.PRIVACY ? 'usa-current' : ''
      }
    >
      {t('privacy')}
    </Link>,
    <Link href="/logout" key="logout" variant="nav">
      {t('logout')}
    </Link>,
  ]

  const onToggle = (
    index: number,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean[]>>
  ): void => {
    setIsOpen((prevIsOpen) => {
      const newIsOpen = [false, false]
      // eslint-disable-next-line security/detect-object-injection
      newIsOpen[index] = !prevIsOpen[index]
      return newIsOpen
    })
  }

  return (
    <>
      <div
        data-testid="overlay"
        className={`usa-overlay ${expanded ? 'is-visible' : ''}`}
      ></div>
      <Header basic={true} basicWithMegaMenu={true}>
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <Title>{t('title')}</Title>
            <NavMenuButton onClick={onClick} label={t('menu')} />
          </div>
          <PrimaryNav
            items={menuItems}
            mobileExpanded={expanded}
            onToggleMobileNav={onClick}
          ></PrimaryNav>
        </div>
      </Header>
    </>
  )
}
