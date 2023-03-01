import { Button } from '@trussworks/react-uswds'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { Routes } from 'constants/routes'

export const UpdateContactButton = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const goToUpdateContactInfoForm = () =>
    router.push(Routes.UPDATE_CONTACT_INFO)
  return (
    <>
      {' '}
      <Button
        type="button"
        secondary
        onClick={goToUpdateContactInfoForm}
        data-testid="go-to-update-contact-info"
      >
        {t('update_contact_info_button')}
      </Button>
    </>
  )
}
