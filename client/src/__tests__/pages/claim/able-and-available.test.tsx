import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import {
  AbleAndAvailable,
  AbleAndAvailablePageDefinition,
} from 'pages/claim/able-and-available'
import { disabilityTypeOptions } from 'constants/formOptions'

describe('AbleAndAvailableStatus component', () => {
  // Re-useable queries
  const queryForDisabledImmediatelyBefore = () =>
    screen.queryByText('able_and_available.disabled_immediately_before.label')
  const queryForTypeOfDisability = () =>
    screen.queryByRole('group', {
      name: 'able_and_available.type_of_disability.label',
    })
  const queryForDateDisabilityBegan = () =>
    screen.queryByText('able_and_available.date_disability_began.label')
  const queryForRecoveryDate = () =>
    screen.queryByText('able_and_available.recovery_date.label')
  const queryForContactEmployer = () =>
    screen.queryByRole('group', {
      name: 'able_and_available.contacted_last_employer_after_recovery.label',
    })

  // Re-useable getters
  const getYesAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'yes' })
  const getNoAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'no' })

  const getCanBeginWorkImmediately = () =>
    screen.getByRole('group', {
      name: 'able_and_available.can_begin_work_immediately.label',
    })
  const getHasCollectedDisability = () =>
    screen.getByRole('group', {
      name: 'able_and_available.has_collected_disability.label',
    })
  const getDisabledImmediatelyBefore = () =>
    screen.getByRole('group', {
      name: 'able_and_available.disabled_immediately_before.label',
    })
  const getTypeOfDisability = () =>
    screen.getByRole('group', {
      name: 'able_and_available.type_of_disability.label',
    })
  const getDateDisabilityBegan = () =>
    screen.getByTestId('date_disability_began.parent-div')
  const getMonthDisabilityBegan = () =>
    within(getDateDisabilityBegan()).getByRole('textbox', { name: /month/i })
  const getDayDisabilityBegan = () =>
    within(getDateDisabilityBegan()).getByRole('textbox', { name: /day/i })
  const getYearDisabilityBegan = () =>
    within(getDateDisabilityBegan()).getByRole('textbox', { name: /year/i })
  const getRecoveryDate = () => screen.getByTestId('recovery_date.parent-div')
  const getRecoveryMonth = () =>
    within(getRecoveryDate()).getByRole('textbox', { name: /month/i })
  const getRecoveryDay = () =>
    within(getRecoveryDate()).getByRole('textbox', { name: /day/i })
  const getRecoveryYear = () =>
    within(getRecoveryDate()).getByRole('textbox', { name: /year/i })
  const getContactedEmployer = () =>
    screen.getByRole('group', {
      name: 'able_and_available.contacted_last_employer_after_recovery.label',
    })

  it('renders properly', async () => {
    render(
      <Formik
        initialValues={AbleAndAvailablePageDefinition.initialValues}
        onSubmit={noop}
      >
        <AbleAndAvailable />
      </Formik>
    )

    // Shows initial questions
    const canBeginWorkImmediately = getCanBeginWorkImmediately()
    const canBeginWorkImmediatelyYes = getYesAnswer(canBeginWorkImmediately)
    const canBeginWorkImmediatelyNo = getNoAnswer(canBeginWorkImmediately)

    const hasCollectedDisability = getHasCollectedDisability()
    const hasCollectedDisabilityYes = getYesAnswer(hasCollectedDisability)
    const hasCollectedDisabilityNo = getNoAnswer(hasCollectedDisability)

    expect(canBeginWorkImmediatelyYes).toBeInTheDocument()
    expect(canBeginWorkImmediatelyNo).toBeInTheDocument()
    expect(hasCollectedDisabilityYes).toBeInTheDocument()
    expect(hasCollectedDisabilityNo).toBeInTheDocument()
  })

  describe('Toggling fields', () => {
    it('Shows fields as expected', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <AbleAndAvailable />
        </Formik>
      )

      const hasCollectedDisability = getHasCollectedDisability()
      const hasCollectedDisabilityYes = getYesAnswer(hasCollectedDisability)

      // Additional questions are not yet shown
      expect(queryForDisabledImmediatelyBefore()).not.toBeInTheDocument()
      expect(queryForTypeOfDisability()).not.toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).not.toBeInTheDocument()
      expect(queryForRecoveryDate()).not.toBeInTheDocument()

      // Toggle fields on
      await user.click(hasCollectedDisabilityYes)
      // Additional questions are now shown
      expect(queryForDisabledImmediatelyBefore()).toBeInTheDocument()
      expect(queryForTypeOfDisability()).toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).toBeInTheDocument()
      expect(queryForRecoveryDate()).toBeInTheDocument()
      const contactEmployer = queryForContactEmployer()
      expect(contactEmployer).toBeInTheDocument()
      expect(contactEmployer?.childElementCount).toEqual(2)
    })

    it('Hides and clears fields as expected', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <AbleAndAvailable />
        </Formik>
      )

      const hasCollectedDisability = getHasCollectedDisability()
      const hasCollectedDisabilityYes = getYesAnswer(hasCollectedDisability)
      const hasCollectedDisabilityNo = getNoAnswer(hasCollectedDisability)

      // Toggle fields on
      await user.click(hasCollectedDisabilityYes)

      const disabledImmediatelyBeforeBeforeClear =
        getDisabledImmediatelyBefore()
      const disabledImmediatelyBeforeYesBeforeClear = getYesAnswer(
        disabledImmediatelyBeforeBeforeClear
      )
      const disabledImmediatelyBeforeNoBeforeClear = getNoAnswer(
        disabledImmediatelyBeforeBeforeClear
      )
      const typeOfDisabilityBeforeClear = getTypeOfDisability()
      const typeOfDisabilityBeforeStatePlanClear = screen.getByRole('radio', {
        name: 'able_and_available.type_of_disability.options.state_plan',
      })
      const monthDisabilityBeganBeforeClear = getMonthDisabilityBegan()
      const dayDisabilityBeganBeforeClear = getDayDisabilityBegan()
      const yearDisabilityBeganBeforeClear = getYearDisabilityBegan()
      const recoveryMonthBeforeClear = getRecoveryMonth()
      const recoveryDayBeforeClear = getRecoveryDay()
      const recoveryYearBeforeClear = getRecoveryYear()

      await user.click(disabledImmediatelyBeforeNoBeforeClear)

      await user.click(typeOfDisabilityBeforeStatePlanClear)

      await user.type(monthDisabilityBeganBeforeClear, '01')
      await user.type(dayDisabilityBeganBeforeClear, '06')
      await user.type(yearDisabilityBeganBeforeClear, '2019')

      await user.type(recoveryMonthBeforeClear, '01')
      await user.type(recoveryDayBeforeClear, '05')
      await user.type(recoveryYearBeforeClear, '2020')

      const contactedEmployerBeforeClear = getContactedEmployer()
      const contactedEmployerYesBeforeClear = getYesAnswer(
        contactedEmployerBeforeClear
      )
      const contactEmployerNoBeforeClear = getNoAnswer(
        contactedEmployerBeforeClear
      )

      await user.click(contactedEmployerYesBeforeClear)

      // Expect the values entered to be selected
      expect(disabledImmediatelyBeforeYesBeforeClear).not.toBeChecked()
      expect(disabledImmediatelyBeforeNoBeforeClear).toBeChecked()
      expect(typeOfDisabilityBeforeStatePlanClear).toBeChecked()
      expect(monthDisabilityBeganBeforeClear).toHaveValue('01')
      expect(dayDisabilityBeganBeforeClear).toHaveValue('06')
      expect(yearDisabilityBeganBeforeClear).toHaveValue('2019')
      expect(recoveryMonthBeforeClear).toHaveValue('01')
      expect(recoveryDayBeforeClear).toHaveValue('05')
      expect(recoveryYearBeforeClear).toHaveValue('2020')
      expect(contactedEmployerYesBeforeClear).toBeChecked()
      expect(contactEmployerNoBeforeClear).not.toBeChecked()

      // Hide all fields
      await user.click(hasCollectedDisabilityNo)

      expect(disabledImmediatelyBeforeYesBeforeClear).not.toBeInTheDocument()
      expect(disabledImmediatelyBeforeNoBeforeClear).not.toBeInTheDocument()
      expect(typeOfDisabilityBeforeClear).not.toBeInTheDocument()
      expect(yearDisabilityBeganBeforeClear).not.toBeInTheDocument()
      expect(recoveryMonthBeforeClear).not.toBeInTheDocument()
      expect(recoveryDayBeforeClear).not.toBeInTheDocument()
      expect(recoveryYearBeforeClear).not.toBeInTheDocument()
      expect(contactedEmployerYesBeforeClear).not.toBeInTheDocument()
      expect(contactEmployerNoBeforeClear).not.toBeInTheDocument()

      // Show all fields
      await user.click(hasCollectedDisabilityYes)

      const disabledImmediatelyBeforeAfterClear = getDisabledImmediatelyBefore()
      const disabledImmediatelyBeforeYesAfterClear = getYesAnswer(
        disabledImmediatelyBeforeAfterClear
      )
      const disabledImmediatelyBeforeNoAfterClear = getNoAnswer(
        disabledImmediatelyBeforeAfterClear
      )
      const typeOfDisabilityStatePlanAfterClear = screen.getByRole('radio', {
        name: 'able_and_available.type_of_disability.options.state_plan',
      })
      const monthDisabilityBeganAfterClear = getMonthDisabilityBegan()
      const dayDisabilityBeganAfterClear = getDayDisabilityBegan()
      const yearDisabilityBeganAfterClear = getYearDisabilityBegan()
      const recoveryMonthAfterClear = getRecoveryMonth()
      const recoveryDayAfterClear = getRecoveryDay()
      const recoveryYearAfterClear = getRecoveryYear()
      const contactedEmployer = getContactedEmployer()

      expect(disabledImmediatelyBeforeYesAfterClear).not.toBeChecked()
      expect(disabledImmediatelyBeforeNoAfterClear).not.toBeChecked()
      expect(typeOfDisabilityStatePlanAfterClear).not.toBeChecked()
      expect(monthDisabilityBeganAfterClear).toHaveValue('')
      expect(dayDisabilityBeganAfterClear).toHaveValue('')
      expect(yearDisabilityBeganAfterClear).toHaveValue('')
      expect(recoveryMonthAfterClear).toHaveValue('')
      expect(recoveryDayAfterClear).toHaveValue('')
      expect(recoveryYearAfterClear).toHaveValue('')
      expect(contactedEmployer).not.toBeChecked()
    }, 10000)
  })

  describe('Validation Schema', () => {
    describe('disabled_immediately_before', () => {
      it.each([true, false])('validates with a valid value', async (value) => {
        const schemaSlice = {
          has_collected_disability: true,
          disabled_immediately_before: value,
        }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `disabled_immediately_before`,
            schemaSlice
          )
        ).resolves.toEqual(value)
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          has_collected_disability: true,
          disabled_immediately_before: undefined,
        }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `disabled_immediately_before`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('type_of_disability', () => {
      it.each(disabilityTypeOptions)(
        'validates with a valid value',
        async (value) => {
          const schemaSlice = {
            has_collected_disability: true,
            type_of_disability: value,
          }

          await expect(
            AbleAndAvailablePageDefinition.validationSchema.validateAt(
              `type_of_disability`,
              schemaSlice
            )
          ).resolves.toEqual(value)
        }
      )

      it('fails validation with an invalid value', async () => {
        const schemaSlice = { type_of_disability: 'invalid value' }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `type_of_disability`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('date_disability_began', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          has_collected_disability: true,
          date_disability_began: '2020-06-26',
        }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `date_disability_began`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          has_collected_disability: true,
          date_disability_began: undefined,
        }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `date_disability_began`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('recovery_date', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          has_collected_disability: true,
          recovery_date: '2020-06-27',
        }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `recovery_date`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value before date_disability_began', async () => {
        const schemaSlice = {
          has_collected_disability: true,
          date_disability_began: '2020-06-25',
          recovery_date: '2020-06-24',
        }

        await expect(
          AbleAndAvailablePageDefinition.validationSchema.validateAt(
            `recovery_date`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
  })
})
