import { Button } from '@trussworks/react-uswds'
import { Routes } from 'constants/routes'
import { useTranslation } from 'react-i18next'
import { useClaimProgress } from 'hooks/useClaimProgress'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { IntakeAppContext } from 'contexts/IntakeAppContext'
import { ClaimFormContext } from '../../contexts/ClaimFormContext'

export const GoToClaimFormButton = () => {
  const router = useRouter()
  const { continuePath } = useClaimProgress()
  const { t } = useTranslation('home')
  const { ssnInput, screenerInput } = useContext(IntakeAppContext)
  const { claimFormValues } = useContext(ClaimFormContext)

  const goToLastUnfinishedClaimFormPage = () => {
    // TODO: handle what to do if they have a completed claim
    let path
    //No SSN in active claims or from login, need to get from user (soon SSN will be populated with information obtained upon login)
    if (claimFormValues?.ssn === undefined && ssnInput?.ssn === undefined) {
      path = Routes.SSN
    } else if (
      claimFormValues?.screener_current_country_us === undefined &&
      screenerInput === undefined
    ) {
      path = Routes.SCREENER
    } else {
      path = continuePath
    }
    router.push(path)
  }

  const setButtonText = () => {
    return claimFormValues !== undefined &&
      Object.keys(claimFormValues).length > 0
      ? t('continue_claim_button')
      : t('file_a_claim_button')
  }

  return (
    <Button
      type="button"
      onClick={goToLastUnfinishedClaimFormPage}
      data-testid="go-to-claim-form"
    >
      {setButtonText()}
    </Button>
  )
}
