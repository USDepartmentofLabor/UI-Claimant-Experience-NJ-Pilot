import {
  DateInput,
  ErrorMessage,
  FormGroup,
  Fieldset,
} from '@trussworks/react-uswds'
import { useField } from 'formik'
import {
  ChangeEventHandler,
  ComponentProps,
  FocusEventHandler,
  KeyboardEventHandler,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { useShowErrors } from 'hooks/useShowErrors'
import { useFocusFirstError } from 'hooks/useFocusFirstError'

import styles from './DateInputField.module.scss'

type DateInputOmitProps =
  | 'id'
  | 'name'
  | 'label'
  | 'minLength'
  | 'maxLength'
  | 'unit'
  | 'onBlur'
  | 'readOnly'
  | 'disabled'

type DateInputProps = Omit<ComponentProps<typeof DateInput>, DateInputOmitProps>

type LegendStyle = ComponentProps<typeof Fieldset>['legendStyle']

type DateFieldProps = {
  id?: string
  name: string
  hint?: string
  readOnly?: boolean
  disabled?: boolean
  monthProps?: DateInputProps
  dayProps?: DateInputProps
  yearProps?: DateInputProps
  legend?: ReactNode
  legendStyle?: LegendStyle
}

const MONTH_MAX_LENGTH = 2
const DAY_MAX_LENGTH = 2
const YEAR_MAX_LENGTH = 4
const VALID_KEYS_REGEXP = /[0-9/]+/
const INPUT_VALUE_REGEXP = /^\d{0,4}-\d{0,2}-\d{0,2}$/

export const DateInputField = ({
  id: idProp,
  name,
  hint,
  readOnly,
  disabled,
  monthProps,
  dayProps,
  yearProps,
  legend,
  legendStyle,
}: DateFieldProps) => {
  const { t } = useTranslation('common')
  const [fieldProps, metaProps, fieldHelperProps] = useField<
    string | undefined
  >(name)

  const parsedValue = useMemo(() => {
    if (metaProps.value && INPUT_VALUE_REGEXP.test(metaProps.value)) {
      const parts = metaProps.value.split('-')
      return { month: parts[1], day: parts[2], year: parts[0] }
    } else {
      return { month: '', day: '', year: '' }
    }
  }, [])

  const [month, setMonth] = useState<string>(() => parsedValue.month)
  const [day, setDay] = useState<string>(() => parsedValue.day)
  const [year, setYear] = useState<string>(() => parsedValue.year)

  const isMounted = useRef(false)
  const dateDivRef = useRef<HTMLDivElement>(null)

  const monthInputRef = useRef<HTMLInputElement>(null)
  const dayInputRef = useRef<HTMLInputElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)

  const showError = useShowErrors(name)
  useFocusFirstError(metaProps.error, monthInputRef)

  const id = idProp || name

  const createFormikDateString = () => {
    if (day || month || year) {
      const paddedMonth =
        month && month.length < MONTH_MAX_LENGTH
          ? month.padStart(MONTH_MAX_LENGTH, '0')
          : month
      const paddedDay =
        day && day.length < DAY_MAX_LENGTH
          ? day.padStart(DAY_MAX_LENGTH, '0')
          : day
      return `${year}-${paddedMonth}-${paddedDay}`
    } else {
      return ''
    }
  }
  const updateFormik = () => {
    const value = createFormikDateString()
    fieldHelperProps.setValue(value) // Should await?
  }

  const updateLocalDateInputState = () => {
    const formikDate = fieldProps.value
    if (formikDate) {
      const [yearField, monthField, dayField] = formikDate.split('-')
      // don't include leading zeros
      setYear(yearField ? yearField.replace(/^0+(?=\d4)/, '') : '')
      setMonth(monthField ? monthField.replace(/^0+(?=\d)/, '') : '')
      setDay(dayField ? dayField.replace(/^0+(?=\d)/, '') : '')
    } else {
      setYear('')
      setMonth('')
      setDay('')
    }
  }

  const getIsEquivalentDate = () => {
    const formikDate = fieldProps.value
    const localStateAsFormikDate = createFormikDateString()
    if (formikDate !== undefined) {
      return localStateAsFormikDate === formikDate
    }
    return false
  }
  // Update formik value when state values change.
  useEffect(() => {
    if (isMounted.current) {
      updateFormik()
    } else {
      isMounted.current = true
    }
  }, [month, day, year])

  useEffect(() => {
    // Reassign display (state) value if the formik and display dates are not equivalent (ex. this can occur when an item of an array that includes this field is removed)
    const isEquivalentDate = getIsEquivalentDate()
    if (!isEquivalentDate) {
      updateLocalDateInputState()
    }
  }, [fieldProps.value])

  // Blur the formik field when the target of the blur event is not part of this component
  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    const { relatedTarget: newTarget } = e
    if (!dateDivRef.current?.contains(newTarget)) {
      fieldProps.onBlur(e)
    }
  }

  const handleMonthChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMonth(e.target.value)
    if (monthProps?.onChange) {
      monthProps.onChange(e)
    }
  }

  const handleDayChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setDay(e.currentTarget.value)
    if (dayProps?.onChange) {
      dayProps.onChange(e)
    }
  }

  const handleYearChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setYear(e.currentTarget.value)
    if (yearProps?.onChange) {
      yearProps.onChange(e)
    }
  }

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // Only allow numeric entry without the use of `type="number"`
    if (!VALID_KEYS_REGEXP.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <FormGroup error={showError}>
      <Fieldset
        className={styles.noTopMarginLegend}
        legend={
          showError ? (
            <span className="usa-label--error">{legend}</span>
          ) : (
            legend
          )
        }
        legendStyle={legendStyle}
        onInvalid={(e) => e.preventDefault()}
      >
        {hint && (
          <span className="usa-hint" id={`${id}.hint`}>
            {hint}
          </span>
        )}
        <div
          id={id}
          className="usa-memorable-date"
          ref={dateDivRef}
          data-testid={`${name}.parent-div`}
        >
          <DateInput
            id={`${id}.month`}
            name={`${name}.month`}
            value={month}
            label={t('date.month.label')}
            unit={'month'}
            minLength={1}
            maxLength={MONTH_MAX_LENGTH}
            onBlur={handleBlur}
            readOnly={readOnly}
            disabled={disabled}
            inputRef={monthInputRef}
            onKeyPress={handleKeyPress}
            {...monthProps}
            onChange={handleMonthChange}
          />
          <DateInput
            id={`${id}.day`}
            name={`${name}.day`}
            value={day}
            label={t('date.day.label')}
            unit={'day'}
            minLength={1}
            maxLength={DAY_MAX_LENGTH}
            onBlur={handleBlur}
            readOnly={readOnly}
            disabled={disabled}
            inputRef={dayInputRef}
            onKeyPress={handleKeyPress}
            {...dayProps}
            onChange={handleDayChange}
          />
          <DateInput
            id={`${id}.year`}
            name={`${name}.year`}
            value={year}
            label={t('date.year.label')}
            unit={'year'}
            minLength={4}
            maxLength={YEAR_MAX_LENGTH}
            onBlur={handleBlur}
            readOnly={readOnly}
            disabled={disabled}
            inputRef={yearInputRef}
            onKeyPress={handleKeyPress}
            {...yearProps}
            onChange={handleYearChange}
          />
        </div>
        {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
      </Fieldset>
    </FormGroup>
  )
}
