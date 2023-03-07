import { Button } from '@trussworks/react-uswds'
import { Routes } from 'constants/routes'
import { useTranslation } from 'react-i18next'
import { useClaimProgress } from 'hooks/useClaimProgress'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { IntakeAppContext } from 'contexts/IntakeAppContext'

export type currentClaimProps = {
  partialClaim?: any
  hasInProgressClaim?: boolean
}
export const GoToClaimFormButton = ({
  partialClaim,
  hasInProgressClaim,
}: currentClaimProps) => {
  const router = useRouter()
  const { continuePath } = useClaimProgress()
  const { t } = useTranslation('home')
  const { ssnInput, screenerInput } = useContext(IntakeAppContext)
  const goToLastUnfinishedClaimFormPage = () => {
    // TODO: handle what to do if they have a completed claim
    let path
    if (partialClaim?.ssn === undefined && ssnInput?.ssn === undefined) {
      path = Routes.SSN
    } else if (
      partialClaim?.screener_current_country_us === undefined &&
      screenerInput === undefined
    ) {
      path = Routes.SCREENER
    } else {
      path = continuePath
    }
    router.push(path)
  }

  const setButtonText = () => {
    return partialClaim
      ? hasInProgressClaim
        ? t('continue_claim_button')
        : t('file_a_claim_button')
      : t('screener_button')
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
