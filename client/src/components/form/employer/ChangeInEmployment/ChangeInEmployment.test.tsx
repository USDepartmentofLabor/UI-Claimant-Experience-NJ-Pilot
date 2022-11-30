import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { ChangeInEmployment } from 'components/form/employer/ChangeInEmployment/ChangeInEmployment'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

describe('Change in Employment component', () => {
  const { data } = useGetRecentEmployers()
  const renderChangeInEmployment = () => {
    render(
      <Formik
        initialValues={{
          employers: data,
        }}
        onSubmit={noop}
      >
        <ChangeInEmployment index="0" />
      </Formik>
    )
    const sectionTitle = screen.getByText('separation.heading')

    const queryForChangeReasonRadioField = () =>
      screen.queryByRole('group', {
        name: 'separation.reason.label',
      })

    const queryForChangeReasonLaidOffAnswer = () =>
      screen.getByTestId('employers[0].separation_circumstance.laid_off')

    const queryForChangeReasonFiredDischargedSuspendedAnswer = () =>
      screen.getByTestId(
        'employers[0].separation_circumstance.fired_discharged_suspended'
      )

    const queryForExpectRecall = () =>
      screen.queryByRole('group', {
        name: 'separation.expect_to_be_recalled.label',
      })

    const queryForExpectRecallNoAnswer = () => {
      const question = queryForExpectRecall()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'no',
          })
        : null
    }

    const queryForExpectRecallYesAnswer = () => {
      const question = queryForExpectRecall()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'yes',
          })
        : null
    }

    const queryForSeparationCircumstanceDetails = () =>
      screen.queryByLabelText(
        'separation.separation_circumstance_details.required_label'
      ) as HTMLElement

    const queryForStartDate = () =>
      screen.queryByText('employment_start_date.label')
    const queryForFinishDate = () =>
      screen.queryByText('employment_last_date.label')
    const queryForDischargeDate = () =>
      screen.queryByText('discharge_date.label')

    const queryForDischargeDateParent = () =>
      screen.getByTestId('employers[0].discharge_date.parent-div')

    const getMonthDischargeDate = () =>
      within(queryForDischargeDateParent()).getByRole('textbox', {
        name: /month/i,
      })
    const getDayDischargeDate = () =>
      within(queryForDischargeDateParent()).getByRole('textbox', {
        name: /day/i,
      })
    const getYearDischargeDate = () =>
      within(queryForDischargeDateParent()).getByRole('textbox', {
        name: /year/i,
      })

    return {
      sectionTitle,
      queryForChangeReasonRadioField,
      queryForChangeReasonLaidOffAnswer,
      queryForChangeReasonFiredDischargedSuspendedAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForSeparationCircumstanceDetails,
      queryForStartDate,
      queryForFinishDate,
      queryForDischargeDate,
      getMonthDischargeDate,
      getDayDischargeDate,
      getYearDischargeDate,
    }
  }
  it('renders without errors', async () => {
    const user = userEvent.setup()
    const {
      sectionTitle,
      queryForChangeReasonLaidOffAnswer,
      queryForChangeReasonFiredDischargedSuspendedAnswer,
      queryForChangeReasonRadioField,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForStartDate,
      queryForFinishDate,
    } = renderChangeInEmployment()
    const changeReasonRadioField = queryForChangeReasonRadioField()
    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const changeReasonFiredDischargedSuspendedAnswer =
      queryForChangeReasonFiredDischargedSuspendedAnswer()
    const expectRecallNoAnswer = queryForExpectRecallNoAnswer()
    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()
    const startDate = queryForStartDate()
    const finishDate = queryForFinishDate()

    expect(sectionTitle).toBeInTheDocument()
    expect(changeReasonRadioField).toBeInTheDocument()
    expect(changeReasonLaidOffAnswer).toBeInTheDocument()
    expect(changeReasonFiredDischargedSuspendedAnswer).toBeInTheDocument()
    expect(expectRecallNoAnswer).toBeInTheDocument()
    expect(expectRecallYesAnswer).toBeInTheDocument()
    expect(startDate).toBeInTheDocument()
    expect(finishDate).not.toBeInTheDocument()

    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()
    expect(queryForFinishDate()).toBeInTheDocument()
  })

  it('fills out answers for "Fired, discharged, or suspended" and checks clearing of separation circumstance details and discharge date', async () => {
    const user = userEvent.setup()
    const {
      queryForChangeReasonLaidOffAnswer,
      queryForChangeReasonFiredDischargedSuspendedAnswer,
      queryForSeparationCircumstanceDetails,
      queryForDischargeDate,
      getDayDischargeDate,
      getMonthDischargeDate,
      getYearDischargeDate,
    } = renderChangeInEmployment()

    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const changeReasonFiredDischargedSuspendedAnswer =
      queryForChangeReasonFiredDischargedSuspendedAnswer()
    let separationCircumstanceDetails = queryForSeparationCircumstanceDetails()
    let dischargeDate = queryForDischargeDate()

    // Separation circumstance details and discharge date should not be in document on load
    expect(changeReasonFiredDischargedSuspendedAnswer).not.toBeChecked()
    expect(separationCircumstanceDetails).not.toBeInTheDocument()
    expect(dischargeDate).not.toBeInTheDocument()

    // Click 'Fired, discharged, or suspended' radio button
    await user.click(changeReasonFiredDischargedSuspendedAnswer as HTMLElement)
    expect(changeReasonFiredDischargedSuspendedAnswer).toBeChecked()

    // Separation circumstance details and discharge date should be in document
    separationCircumstanceDetails = queryForDischargeDate() as HTMLElement
    dischargeDate = queryForDischargeDate()
    expect(separationCircumstanceDetails).toBeInTheDocument()
    expect(dischargeDate).toBeInTheDocument()

    // Add text to separation circumstance details comment box
    separationCircumstanceDetails = queryForSeparationCircumstanceDetails()
    await user.type(separationCircumstanceDetails, 'Some text here')
    expect(queryForSeparationCircumstanceDetails()).toHaveValue(
      'Some text here'
    )

    // Add values to discharge date and check values
    const dischargeDateDayField = getDayDischargeDate()
    const dischargeDateMonthField = getMonthDischargeDate()
    const dischargeDateYearField = getYearDischargeDate()
    await user.type(dischargeDateMonthField, '01')
    await user.type(dischargeDateDayField, '06')
    await user.type(dischargeDateYearField, '2023')
    expect(getMonthDischargeDate()).toHaveValue('01')
    expect(getDayDischargeDate()).toHaveValue('06')
    expect(getYearDischargeDate()).toHaveValue('2023')

    // Click 'Laid off' radio button
    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()
    expect(changeReasonFiredDischargedSuspendedAnswer).not.toBeChecked()

    // Separation circumstance details and discharge date should not be in document
    expect(separationCircumstanceDetails).not.toBeInTheDocument()
    expect(dischargeDate).not.toBeInTheDocument()

    // Click 'Fired, discharged, or suspended' radio button
    await user.click(changeReasonFiredDischargedSuspendedAnswer as HTMLElement)
    expect(changeReasonFiredDischargedSuspendedAnswer).toBeChecked()

    // Separation circumstance details and discharge date should be back in document
    separationCircumstanceDetails = queryForDischargeDate() as HTMLElement
    dischargeDate = queryForDischargeDate()
    expect(separationCircumstanceDetails).toBeInTheDocument()
    expect(dischargeDate).toBeInTheDocument()

    // Values in separation circumstance details and discharge date should be empty
    expect(queryForSeparationCircumstanceDetails()).toHaveValue('')
    expect(getMonthDischargeDate()).toHaveValue('')
    expect(getDayDischargeDate()).toHaveValue('')
    expect(getYearDischargeDate()).toHaveValue('')
  })
})
