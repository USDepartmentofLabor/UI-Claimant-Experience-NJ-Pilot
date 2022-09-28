import states from 'fixtures/states.json'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { ComponentProps } from 'react'
import styles from 'styles/pages/claim/personal.module.scss'

export type StateAbbrev = keyof typeof states

type DropdownProps = ComponentProps<typeof DropdownField>

type StatesDropdownProps = {
  stateSlice?: StateAbbrev[]
} & Omit<DropdownProps, 'options'>

const allStates = Object.entries(states).map(([key]) => ({
  label: key,
  value: key,
}))

export const StatesDropdown = ({
  label,
  id,
  name,
  startEmpty,
  stateSlice,
}: StatesDropdownProps) => (
  <DropdownField
    label={label}
    id={id}
    name={name}
    startEmpty={startEmpty}
    options={
      stateSlice
        ? allStates.filter((opt) =>
            stateSlice.includes(opt.value as StateAbbrev)
          )
        : allStates
    }
    className={styles.state}
  />
)
