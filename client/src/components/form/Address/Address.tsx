import { useTranslation } from 'react-i18next'
import TextField from '../fields/TextField/TextField'
import { FormGroup } from '@trussworks/react-uswds'
import { StateAbbrev, StatesDropdown } from '../StatesDropdown/StatesDropdown'
import styles from 'styles/pages/claim/personal.module.scss'

interface IAddressLabels {
  address: string
  city: string
  state: string
  zipcode: string
}

interface IAddressProps {
  labels?: IAddressLabels
  basename: string
  stateSlice?: StateAbbrev[]
}

export const Address = ({ labels, basename, stateSlice }: IAddressProps) => {
  const { t } = useTranslation('common')
  const defaultLabels: IAddressLabels = {
    address: t('address.address.label'),
    city: t('address.city.label'),
    state: t('address.state.label'),
    zipcode: t('address.zipcode.label'),
  }

  return (
    <FormGroup>
      <TextField
        name={`${basename}.address`}
        label={labels ? labels.address : defaultLabels.address}
        type="text"
        data-testid={`${basename}.address`}
      />
      <div
        className="usa-memorable-date"
        data-testid={`${basename}.parent-div`}
      >
        <TextField
          name={`${basename}.city`}
          label={labels ? labels.city : defaultLabels.city}
          type="text"
          data-testid={`${basename}.city`}
          className={styles.city}
        />
        <StatesDropdown
          name={`${basename}.state`}
          label={labels ? labels.state : defaultLabels.state}
          data-testid={`${basename}.state`}
          startEmpty
          stateSlice={stateSlice}
        />
      </div>
      <TextField
        // TODO pass medium
        name={`${basename}.zipcode`}
        label={labels ? labels.zipcode : defaultLabels.zipcode}
        type="text"
        inputMode="numeric"
        data-testid={`${basename}.zipcode`}
        className={styles.zipcode}
      />
    </FormGroup>
  )
}

export default Address
