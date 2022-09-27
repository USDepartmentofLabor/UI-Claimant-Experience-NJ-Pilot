import TextField from '../fields/TextField/TextField'
import { useTranslation } from 'react-i18next'
import DropdownField from 'components/form/fields/DropdownField/DropdownField'
import { suffixOptions } from 'constants/formOptions'
import styles from 'styles/pages/claim/personal.module.scss'

interface INameProps {
  id?: string
  name: string
}

export const Name = ({ id: idProp, name }: INameProps) => {
  const { t } = useTranslation('claimForm')

  const id = idProp || name

  return (
    <>
      <TextField
        id={`${id}.first_name`}
        name={`${name}.first_name`}
        label={t('name.first_name.label')}
        type="text"
      />
      <TextField
        id={`${id}.middle_initial`}
        name={`${name}.middle_initial`}
        label={t('name.middle_initial.label')}
        type="text"
      />
      <TextField
        id={`${id}.last_name`}
        name={`${name}.last_name`}
        label={t('name.last_name.label')}
        type="text"
      />
      <DropdownField
        name={`${name}.suffix`}
        label={t('name.suffix.label')}
        className={styles.suffix}
        startEmpty
        options={suffixOptions.map((option) => ({
          value: option,
          label: t(`name.suffix.options.${option}`),
        }))}
      />
    </>
  )
}
