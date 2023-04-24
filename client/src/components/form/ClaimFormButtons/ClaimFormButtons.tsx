import styles from './ClaimFormButtons.module.scss'
import { FormGroup } from '@trussworks/react-uswds'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

interface IClaimFormButtonsProps {
  nextStep?: string
  children: ReactNode
}

const ClaimFormButtons = ({ children, nextStep }: IClaimFormButtonsProps) => {
  const { t } = useTranslation('claimForm')

  return (
    <div className={styles.pagination}>
      <FormGroup>
        {nextStep && (
          <div
            className="text-center text-italic margin-bottom-2"
            data-testid="claim-form-buttons-next-step"
          >
            {t('pagination.next_step', {
              stepName: nextStep,
            })}
          </div>
        )}
        <div className="text-center">{children}</div>
      </FormGroup>
    </div>
  )
}

export default ClaimFormButtons
