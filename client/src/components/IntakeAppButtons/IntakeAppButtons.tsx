import { FormGroup } from '@trussworks/react-uswds'
import styles from './IntakeAppButtons.module.scss'
import { ReactNode } from 'react'

interface IIntakeAppButtonsProps {
  nextStep?: string
  children: ReactNode
}
export const IntakeAppButtons = ({ children }: IIntakeAppButtonsProps) => {
  return (
    <div className={styles.pagination} data-testid="intake-app-buttons-wrapper">
      <FormGroup>
        <div className="text-center">{children}</div>
      </FormGroup>
    </div>
  )
}
