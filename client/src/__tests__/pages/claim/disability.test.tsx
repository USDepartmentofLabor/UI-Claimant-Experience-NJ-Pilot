import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from 'formik'
import { noop } from 'helpers/noop/noop'
import { Disability, DisabilityPageDefinition } from 'pages/claim/disability'

describe('DisabilityStatus component', () => {
  // Re-useable queries
  const queryForDisabledImmediatelyBefore = () =>
    screen.queryByText('disability.disabled_immediately_before.label')
  const queryForTypeOfDisability = () =>
    screen.queryByText('disability.type_of_disability.label')
  const queryForDateDisabilityBegan = () =>
    screen.queryByText('disability.date_disability_began.label')
  const queryForRecoveryDate = () =>
    screen.queryByText('disability.recovery_date.label')
  const queryForContactEmployer = () =>
    screen.queryByRole('group', {
      name: 'disability.contact_employer_after_recovering.label',
    })

  // Re-useable getters
  const getYesAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'yes' })
  const getNoAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'no' })

  const getHasCollectedDisability = () =>
    screen.getByRole('group', {
      name: 'disability.has_collected_disability.label',
    })
  const getDisabledImmediatelyBefore = () =>
    screen.getByRole('group', {
      name: 'disability.disabled_immediately_before.label',
    })
  const getTypeOfDisability = () =>
    screen.getByLabelText('disability.type_of_disability.label')
  const getDateDisabilityBegan = () =>
    screen.getByLabelText('disability.date_disability_began.label')
  const getRecoveryDate = () =>
    screen.getByLabelText('disability.recovery_date.label')
  const getContactEmployer = () =>
    screen.getByRole('group', {
      name: 'disability.contact_employer_after_recovering.label',
    })

  it('renders properly', async () => {
    render(
      <Formik
        initialValues={DisabilityPageDefinition.initialValues}
        onSubmit={noop}
      >
        <Disability />
      </Formik>
    )

    // Shows initial question
    const hasCollectedDisability = getHasCollectedDisability()
    const hasCollectedDisabilityYes = getYesAnswer(hasCollectedDisability)
    const hasCollectedDisabilityNo = getNoAnswer(hasCollectedDisability)

    expect(hasCollectedDisabilityYes).toBeInTheDocument()
    expect(hasCollectedDisabilityNo).toBeInTheDocument()
  })

  describe('Toggling fields', () => {
    it('Shows fields as expected', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <Disability />
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

      const recoveryDateField = getRecoveryDate()

      // contact_employer_after_recovering is hidden by default
      expect(queryForContactEmployer()).not.toBeInTheDocument()

      // Entering a date in the recovery_date field toggles
      // contact_employer_after_recovering on
      await user.type(recoveryDateField, '2020-01-01')

      // contact_employer_after_recovering is now shown
      const contactEmployer = queryForContactEmployer()
      expect(contactEmployer).toBeInTheDocument()
      expect(contactEmployer?.childElementCount).toEqual(2)
    })

    it('Hides and clears fields as expected', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <Disability />
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
      const typeOfDisabilityDropdownBeforeClear = getTypeOfDisability()
      const dateDisabilityBeganBeforeClear = getDateDisabilityBegan()
      const recoveryDateBeforeClear = getRecoveryDate()

      await user.click(disabledImmediatelyBeforeNoBeforeClear)
      await user.selectOptions(
        typeOfDisabilityDropdownBeforeClear,
        'state_plan'
      )
      await user.type(dateDisabilityBeganBeforeClear, '2019/01/06')
      await user.type(recoveryDateBeforeClear, '2020/01/01')

      const contactEmployerBeforeClear = getContactEmployer()
      const contactEmployerYesBeforeClear = getYesAnswer(
        contactEmployerBeforeClear
      )
      const contactEmployerNoBeforeClear = getNoAnswer(
        contactEmployerBeforeClear
      )

      await user.click(contactEmployerYesBeforeClear)

      // Expect the values entered to be selected
      expect(disabledImmediatelyBeforeYesBeforeClear).not.toBeChecked()
      expect(disabledImmediatelyBeforeNoBeforeClear).toBeChecked()
      expect(typeOfDisabilityDropdownBeforeClear).toHaveValue('state_plan')
      expect(dateDisabilityBeganBeforeClear).toHaveValue('2019/01/06')
      expect(recoveryDateBeforeClear).toHaveValue('2020/01/01')
      expect(contactEmployerYesBeforeClear).toBeChecked()
      expect(contactEmployerNoBeforeClear).not.toBeChecked()

      // Hide all fields
      await user.click(hasCollectedDisabilityNo)

      expect(disabledImmediatelyBeforeYesBeforeClear).not.toBeInTheDocument()
      expect(disabledImmediatelyBeforeNoBeforeClear).not.toBeInTheDocument()
      expect(typeOfDisabilityDropdownBeforeClear).not.toBeInTheDocument()
      expect(dateDisabilityBeganBeforeClear).not.toBeInTheDocument()
      expect(recoveryDateBeforeClear).not.toBeInTheDocument()
      expect(contactEmployerYesBeforeClear).not.toBeInTheDocument()
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
      const typeOfDisabilityDropdownAfterClear = getTypeOfDisability()
      const dateDisabilityBeganAfterClear = getDateDisabilityBegan()
      const recoveryDateAfterClear = getRecoveryDate()
      const contactEmployer = queryForContactEmployer()

      expect(disabledImmediatelyBeforeYesAfterClear).not.toBeChecked()
      expect(disabledImmediatelyBeforeNoAfterClear).not.toBeChecked()
      expect(typeOfDisabilityDropdownAfterClear).toHaveValue('')
      expect(dateDisabilityBeganAfterClear).toHaveValue('')
      expect(recoveryDateAfterClear).toHaveValue('')
      expect(contactEmployer).not.toBeInTheDocument()
    })

    it('Hides and clears contact_employer_after_recovering as expected', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <Disability />
        </Formik>
      )

      const hasCollectedDisability = getHasCollectedDisability()
      const hasCollectedDisabilityYes = within(
        hasCollectedDisability
      ).getByRole('radio', { name: 'yes' })

      // Toggle fields on
      await user.click(hasCollectedDisabilityYes)

      const recoveryDate = getRecoveryDate()

      // Entering a date in the recovery_date field toggles
      // contact_employer_after_recovering on
      await user.type(recoveryDate, '2020-01-01')

      // Select an answer to contact_employer_after_recovering
      const contactEmployerBeforeClear = getContactEmployer()
      const contactEmployerBeforeClearYes = getYesAnswer(
        contactEmployerBeforeClear
      )
      const contactEmployerBeforeClearNo = getNoAnswer(
        contactEmployerBeforeClear
      )

      await user.click(contactEmployerBeforeClearYes)

      expect(contactEmployerBeforeClearYes).toBeChecked()
      expect(contactEmployerBeforeClearNo).not.toBeChecked()

      // Clear input to recovery date, which should toggle
      // contact_employer_after_recovering off
      await user.clear(recoveryDate)

      expect(queryForContactEmployer()).not.toBeInTheDocument()

      // Enter a date again to make the field appear
      await user.type(recoveryDate, '2020-01-01')

      // Verify that when contact_employer_after_recovering re-appears, the
      // previous selection has been cleared
      const contactEmployerAfterClear = getContactEmployer()
      const contactEmployerAfterClearYes = getYesAnswer(
        contactEmployerAfterClear
      )
      const contactEmployerAfterClearNo = getNoAnswer(contactEmployerAfterClear)

      expect(contactEmployerAfterClearYes).not.toBeChecked()
      expect(contactEmployerAfterClearNo).not.toBeChecked()
    })
  })
})
