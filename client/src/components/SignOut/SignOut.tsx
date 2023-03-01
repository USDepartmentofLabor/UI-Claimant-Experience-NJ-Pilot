import { Button, Link } from '@trussworks/react-uswds'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { cognitoSignOut } from 'utils/signout/cognitoSignOut'

type SignOutProps = {
  isNavLink: boolean
}

export const SignOut = ({ isNavLink }: SignOutProps) => {
  const { t } = useTranslation('common', { keyPrefix: 'header' })

  const handleOnClickSignOut = (ev: React.SyntheticEvent) => {
    if (isNavLink) ev.preventDefault()
    cognitoSignOut()
  }

  const linkEl = (
    <Link
      href="#"
      // Override href default to place onClick event
      onClick={handleOnClickSignOut}
      key="logout"
      variant="nav"
    >
      {t('logout')}
    </Link>
  )

  const buttonEl = (
    <Button
      id="signOutButtonCmp"
      accentStyle="warm"
      type="button"
      data-testid="sign-out-button-cmp"
      onClick={handleOnClickSignOut}
    >
      {t('signout')}
    </Button>
  )

  return isNavLink ? linkEl : buttonEl
}
