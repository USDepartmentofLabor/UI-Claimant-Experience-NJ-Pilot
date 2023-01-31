import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Disability } from 'pages/claim/disability'
import {
  disabilityTypeOptions,
  disabilityPaymentTypeOptions,
} from 'constants/formOptions'
import { DisabilityPageDefinition } from 'constants/pages/definitions/disabilityPageDefinition'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('DisabilityStatus component', () => {
  // Re-useable queries
  const queryForDisabledImmediatelyBefore = () =>
    screen.queryByText('disability.disabled_immediately_before.label')
  const queryForTypeOfDisability = () =>
    screen.queryByRole('group', {
      name: 'disability.type_of_disability.label',
    })
  const queryForDateDisabilityBegan = () =>
    screen.queryByText('disability.date_disability_began.label')
  const queryForRecoveryDate = () =>
    screen.queryByText('disability.recovery_date.label')
  const queryForContactEmployer = () =>
    screen.queryByRole('group', {
      name: 'disability.contacted_last_employer_after_recovery.label',
    })

  // Re-useable getters
  const getYesAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'yes' })
  const getNoAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'no' })

  const getDisabledImmediatelyBefore = () =>
    screen.getByRole('group', {
      name: 'disability.disabled_immediately_before.label',
    })
  const getTypeOfDisability = () =>
    screen.getByRole('group', {
      name: 'disability.type_of_disability.label',
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
      name: 'disability.contacted_last_employer_after_recovery.label',
    })

  it('renders properly', async () => {
    render(<Disability />)

    const hasCollectedDisabilityDisability = screen.getByRole('checkbox', {
      name: 'disability.disability_applied_to_or_received.options.disability',
    })
    const hasCollectedDisabilityFamilyLeave = screen.getByRole('checkbox', {
      name: 'disability.disability_applied_to_or_received.options.family_leave',
    })
    const hasCollectedDisabilitySocialSecurity = screen.getByRole('checkbox', {
      name: 'disability.disability_applied_to_or_received.options.social_security',
    })
    const hasCollectedDisabilityNone = screen.getByRole('checkbox', {
      name: 'disability.disability_applied_to_or_received.options.none',
    })
    // Shows initial questions
    expect(hasCollectedDisabilityDisability).toBeInTheDocument()
    expect(hasCollectedDisabilityFamilyLeave).toBeInTheDocument()
    expect(hasCollectedDisabilitySocialSecurity).toBeInTheDocument()
    expect(hasCollectedDisabilityNone).toBeInTheDocument()
  })

  describe('Toggling fields', () => {
    it('Shows fields as expected', async () => {
      const user = userEvent.setup()
      render(<Disability />)

      const hasCollectedDisabilityDisability = screen.getByRole('checkbox', {
        name: 'disability.disability_applied_to_or_received.options.disability',
      })
      const hasCollectedDisabilityFamilyLeave = screen.getByRole('checkbox', {
        name: 'disability.disability_applied_to_or_received.options.family_leave',
      })
      const hasCollectedDisabilitySocialSecurity = screen.getByRole(
        'checkbox',
        {
          name: 'disability.disability_applied_to_or_received.options.social_security',
        }
      )
      const hasCollectedDisabilityNone = screen.getByRole('checkbox', {
        name: 'disability.disability_applied_to_or_received.options.none',
      })

      // Additional questions are not yet shown
      expect(queryForDisabledImmediatelyBefore()).not.toBeInTheDocument()
      expect(queryForTypeOfDisability()).not.toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).not.toBeInTheDocument()
      expect(queryForRecoveryDate()).not.toBeInTheDocument()

      // Toggle checkboxes on that don't trigger the other fields
      await user.click(hasCollectedDisabilitySocialSecurity)

      // Additional questions are still not yet shown
      expect(queryForDisabledImmediatelyBefore()).not.toBeInTheDocument()
      expect(queryForTypeOfDisability()).not.toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).not.toBeInTheDocument()
      expect(queryForRecoveryDate()).not.toBeInTheDocument()

      await user.click(hasCollectedDisabilityDisability)

      // Additional questions are now shown
      expect(queryForDisabledImmediatelyBefore()).toBeInTheDocument()
      expect(queryForTypeOfDisability()).toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).toBeInTheDocument()
      expect(queryForRecoveryDate()).toBeInTheDocument()
      const contactEmployer = queryForContactEmployer()
      expect(contactEmployer).toBeInTheDocument()
      expect(contactEmployer?.childElementCount).toEqual(2)

      // uncheck disability checkbox
      await user.click(hasCollectedDisabilityDisability)
      // check family leave checkbox
      await user.click(hasCollectedDisabilityFamilyLeave)
      expect(queryForDisabledImmediatelyBefore()).toBeInTheDocument()
      expect(queryForTypeOfDisability()).toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).toBeInTheDocument()
      expect(queryForRecoveryDate()).toBeInTheDocument()
      const contactEmployerAgain = queryForContactEmployer()
      expect(contactEmployerAgain).toBeInTheDocument()
      expect(contactEmployerAgain?.childElementCount).toEqual(2)

      await user.click(hasCollectedDisabilityNone)
      expect(hasCollectedDisabilityDisability).toBeDisabled()
      expect(hasCollectedDisabilityFamilyLeave).toBeDisabled()
      expect(hasCollectedDisabilitySocialSecurity).toBeDisabled()
      expect(queryForDisabledImmediatelyBefore()).not.toBeInTheDocument()
      expect(queryForTypeOfDisability()).not.toBeInTheDocument()
      expect(queryForDateDisabilityBegan()).not.toBeInTheDocument()
      expect(queryForRecoveryDate()).not.toBeInTheDocument()
    })

    it('Hides and clears fields as expected', async () => {
      const user = userEvent.setup()
      render(<Disability />)

      const hasCollectedDisabilityDisability = screen.getByRole('checkbox', {
        name: 'disability.disability_applied_to_or_received.options.disability',
      })
      // Toggle fields on
      await user.click(hasCollectedDisabilityDisability)

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
        name: 'disability.type_of_disability.options.state_plan',
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

      // Hide all fields by unchecking the disability option
      await user.click(hasCollectedDisabilityDisability)

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
      await user.click(hasCollectedDisabilityDisability)

      const disabledImmediatelyBeforeAfterClear = getDisabledImmediatelyBefore()
      const disabledImmediatelyBeforeYesAfterClear = getYesAnswer(
        disabledImmediatelyBeforeAfterClear
      )
      const disabledImmediatelyBeforeNoAfterClear = getNoAnswer(
        disabledImmediatelyBeforeAfterClear
      )
      const typeOfDisabilityStatePlanAfterClear = screen.getByRole('radio', {
        name: 'disability.type_of_disability.options.state_plan',
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
          disability_applied_to_or_received: ['disability', 'family_leave'],
          disabled_immediately_before: value,
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `disabled_immediately_before`,
            schemaSlice
          )
        ).resolves.toEqual(value)
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          disability_applied_to_or_received: ['disability'],
          disabled_immediately_before: undefined,
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `disabled_immediately_before`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('disability_applied_to_or_received', () => {
      it.each(disabilityPaymentTypeOptions)(
        'validates with a valid value',
        async (value) => {
          const schemaSlice = {
            disability_applied_to_or_received: [value],
          }

          await expect(
            DisabilityPageDefinition.validationSchema.validateAt(
              `disability_applied_to_or_received`,
              schemaSlice
            )
          ).resolves.toEqual([value])
        }
      )

      it('fails validation with an invalid value', async () => {
        const schemaSlice = { type_of_disability: 'invalid value' }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `type_of_disability`,
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
            disability_applied_to_or_received: ['family_leave'],
            type_of_disability: value,
          }

          await expect(
            DisabilityPageDefinition.validationSchema.validateAt(
              `type_of_disability`,
              schemaSlice
            )
          ).resolves.toEqual(value)
        }
      )

      it('fails validation with an invalid value', async () => {
        const schemaSlice = { type_of_disability: 'invalid value' }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `type_of_disability`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('date_disability_began', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          disability_applied_to_or_received: ['disability', 'family_leave'],
          date_disability_began: '2020-06-26',
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `date_disability_began`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          disability_applied_to_or_received: ['disability'],
          date_disability_began: undefined,
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `date_disability_began`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('recovery_date', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          disability_applied_to_or_received: ['disability', 'family_leave'],
          recovery_date: '2020-06-27',
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `recovery_date`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value before date_disability_began', async () => {
        const schemaSlice = {
          disability_applied_to_or_received: ['disability', 'family_leave'],
          date_disability_began: '2020-06-25',
          recovery_date: '2020-06-24',
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `recovery_date`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
    describe('contacted_last_employer_after_recovery', () => {
      it.each([true, false])('validates with a valid value', async (value) => {
        const schemaSlice = {
          disability_applied_to_or_received: ['family_leave'],
          contacted_last_employer_after_recovery: value,
        }

        await expect(
          DisabilityPageDefinition.validationSchema.validateAt(
            `contacted_last_employer_after_recovery`,
            schemaSlice
          )
        ).resolves.toEqual(value)
      })
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Disability
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
