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

  /**
   * It is desired to default display without leading zeroes, while maintaining the formik date behind the scenes with
   * leading zeroes, always
   * @param formikDate
   */
  const getDisplayDatePartsFromFormikDate = (
    formikDate: string | undefined
  ) => {
    if (formikDate && INPUT_VALUE_REGEXP.test(formikDate)) {
      const [year, month, day] = formikDate.split('-')
      return {
        month: month ? month.replace(/^0+(?=\d)/, '') : '',
        day: day ? day.replace(/^0+(?=\d)/, '') : '',
        year: year || '',
      }
    } else {
      return { month: '', day: '', year: '' }
    }
  }

  const parsedInitialDisplayValue = useMemo(() => {
    return getDisplayDatePartsFromFormikDate(metaProps.value)
  }, [])

  const [month, setMonth] = useState<string>(
    () => parsedInitialDisplayValue.month
  )
  const [day, setDay] = useState<string>(() => parsedInitialDisplayValue.day)
  const [year, setYear] = useState<string>(() => parsedInitialDisplayValue.year)

  const dateDivRef = useRef<HTMLDivElement>(null)

  const monthInputRef = useRef<HTMLInputElement>(null)
  const dayInputRef = useRef<HTMLInputElement>(null)
  const yearInputRef = useRef<HTMLInputElement>(null)

  const showError = useShowErrors(name)
  useFocusFirstError(metaProps.error, monthInputRef)

  const id = idProp || name

  const createFormikDateString = (month: string, day: string, year: string) => {
    if (month || day || year) {
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
  const updateFormik = async (month: string, day: string, year: string) => {
    const value = createFormikDateString(month, day, year)
    await fieldHelperProps.setValue(value)
  }

  const updateLocalDateInputState = () => {
    const formikDate = fieldProps.value
    if (formikDate) {
      const { month, day, year } = getDisplayDatePartsFromFormikDate(formikDate)
      setMonth(month)
      setDay(day)
      setYear(year)
    } else {
      setYear('')
      setMonth('')
      setDay('')
    }
  }

  const getIsEquivalentDate = () => {
    const formikDate = fieldProps.value
    const localStateAsFormikDate = createFormikDateString(month, day, year)
    if (formikDate !== undefined) {
      return localStateAsFormikDate === formikDate
    }
    return false
  }

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

  const handleMonthChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setMonth(e.target.value)
    await updateFormik(e.target.value, day, year)
    if (monthProps?.onChange) {
      monthProps.onChange(e)
    }
  }

  const handleDayChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setDay(e.currentTarget.value)
    await updateFormik(month, e.target.value, year)
    if (dayProps?.onChange) {
      dayProps.onChange(e)
    }
  }

  const handleYearChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    setYear(e.currentTarget.value)
    await updateFormik(month, day, e.target.value)
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
        {showError && <ErrorMessage>{metaProps.error}</ErrorMessage>}
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
      </Fieldset>
    </FormGroup>
  )
}
