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

    const queryForChangeReasonStillEmployedAnswer = () =>
      screen.getByTestId('employers[0].separation_circumstance.still_employed')
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

    const queryForReasonStillEmployedQuestion = () =>
      screen.queryByRole('group', {
        name: 'separation.reasons.still_employed.option_heading',
      })
    const queryForHoursReducedByEmployerAnswer = () => {
      const question = queryForReasonStillEmployedQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'separation.reasons.still_employed.options.reduction_in_hours_by_employer',
          })
        : null
    }
    const queryForHoursReducedByClaimantAnswer = () => {
      const question = queryForReasonStillEmployedQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'separation.reasons.still_employed.options.reduction_in_hours_by_claimant',
          })
        : null
    }
    const queryForReduced20PercentQuestion = () =>
      screen.queryByRole('group', {
        name: 'hours_reduced_twenty_percent.label',
      })
    const queryForReduced20PercentYesAnswer = () => {
      const question = queryForReduced20PercentQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'yes',
          })
        : null
    }
    const queryForReduced20PercentNoAnswer = () => {
      const question = queryForReduced20PercentQuestion()
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

    const queryForHaveDefiniteDateOfRecall = () =>
      screen.queryByRole('group', {
        name: 'separation.definite_recall.label',
      })

    const queryForHaveDefiniteDateOfRecallNoAnswer = () => {
      const question = queryForHaveDefiniteDateOfRecall()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'no',
          })
        : null
    }

    const queryForHaveDefiniteDateOfRecallYesAnswer = () => {
      const question = queryForHaveDefiniteDateOfRecall()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'yes',
          })
        : null
    }

    const queryForIsSeasonal = () =>
      screen.queryByRole('group', {
        name: 'separation.definite_recall.label',
      })

    const queryForIsSeasonalNoAnswer = () => {
      const question = queryForIsSeasonal()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'no',
          })
        : null
    }

    const queryForIsSeasonalYesAnswer = () => {
      const question = queryForIsSeasonal()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'yes',
          })
        : null
    }

    const queryForStartDate = () =>
      screen.queryByText('employment_start_date.label')
    const queryForFinishDate = () =>
      screen.queryByText('employment_last_date.label')
    const queryForRecallDate = () =>
      screen.queryByText('definite_recall_date.label', { exact: false })

    const queryForStartDateParent = () =>
      screen.getByTestId('employers[0].employment_start_date.parent-div')

    const queryForLastDateParent = () =>
      screen.getByTestId('employers[0].employment_last_date.parent-div')

    const queryForRecallDateParent = () =>
      screen.getByTestId('employers[0].definite_recall_date.parent-div')

    const getMonthRecallDate = () =>
      within(queryForRecallDateParent()).getByRole('textbox', {
        name: /month/i,
      })
    const getDayRecallDate = () =>
      within(queryForRecallDateParent()).getByRole('textbox', { name: /day/i })
    const getYearRecallDate = () =>
      within(queryForRecallDateParent()).getByRole('textbox', { name: /year/i })

    const getMonthStartDate = () =>
      within(queryForStartDateParent()).getByRole('textbox', {
        name: /month/i,
      })
    const getDayStartDate = () =>
      within(queryForStartDateParent()).getByRole('textbox', { name: /day/i })
    const getYearStartDate = () =>
      within(queryForStartDateParent()).getByRole('textbox', { name: /year/i })

    const getMonthLastDate = () =>
      within(queryForLastDateParent()).getByRole('textbox', {
        name: /month/i,
      })
    const getDayLastDate = () =>
      within(queryForLastDateParent()).getByRole('textbox', { name: /day/i })
    const getYearLastDate = () =>
      within(queryForLastDateParent()).getByRole('textbox', { name: /year/i })

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
      queryForChangeReasonStillEmployedAnswer,
      queryForHoursReducedByEmployerAnswer,
      queryForHoursReducedByClaimantAnswer,
      queryForReasonStillEmployedQuestion,
      queryForReduced20PercentQuestion,
      queryForReduced20PercentYesAnswer,
      queryForReduced20PercentNoAnswer,
      queryForChangeReasonFiredDischargedSuspendedAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForHaveDefiniteDateOfRecall,
      queryForHaveDefiniteDateOfRecallNoAnswer,
      queryForHaveDefiniteDateOfRecallYesAnswer,
      queryForIsSeasonalNoAnswer,
      queryForIsSeasonalYesAnswer,
      queryForSeparationCircumstanceDetails,
      queryForStartDate,
      queryForFinishDate,
      queryForRecallDate,
      getMonthRecallDate,
      getDayRecallDate,
      getYearRecallDate,
      getDayStartDate,
      getMonthStartDate,
      getYearStartDate,
      getDayLastDate,
      getMonthLastDate,
      getYearLastDate,
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
      queryForChangeReasonStillEmployedAnswer,
      queryForChangeReasonRadioField,
      queryForChangeReasonFiredDischargedSuspendedAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForHaveDefiniteDateOfRecallNoAnswer,
      queryForHaveDefiniteDateOfRecallYesAnswer,
      queryForIsSeasonalNoAnswer,
      queryForIsSeasonalYesAnswer,
      queryForStartDate,
      queryForFinishDate,
      queryForRecallDate,
    } = renderChangeInEmployment()
    const changeReasonRadioField = queryForChangeReasonRadioField()
    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const changeReasonStillEmployedAnswer =
      queryForChangeReasonStillEmployedAnswer()
    const changeReasonFiredDischargedSuspendedAnswer =
      queryForChangeReasonFiredDischargedSuspendedAnswer()
    const expectRecallNoAnswer = queryForExpectRecallNoAnswer()
    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()
    const haveDefiniteDateOfRecallNoAnswer =
      queryForHaveDefiniteDateOfRecallNoAnswer()
    const haveDefiniteDateOfRecallYesAnswer =
      queryForHaveDefiniteDateOfRecallYesAnswer()
    const isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    const isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    const startDate = queryForStartDate()
    const finishDate = queryForFinishDate()
    const recallDate = queryForRecallDate()

    expect(sectionTitle).toBeInTheDocument()
    expect(changeReasonRadioField).toBeInTheDocument()
    expect(changeReasonLaidOffAnswer).toBeInTheDocument()
    expect(changeReasonFiredDischargedSuspendedAnswer).toBeInTheDocument()
    expect(expectRecallNoAnswer).toBeInTheDocument()
    expect(expectRecallYesAnswer).toBeInTheDocument()
    expect(startDate).toBeInTheDocument()
    expect(finishDate).toBeInTheDocument()

    expect(haveDefiniteDateOfRecallNoAnswer).not.toBeInTheDocument()
    expect(haveDefiniteDateOfRecallYesAnswer).not.toBeInTheDocument()
    expect(isSeasonalNoAnswer).not.toBeInTheDocument()
    expect(isSeasonalYesAnswer).not.toBeInTheDocument()
    expect(recallDate).not.toBeInTheDocument()

    await user.click(changeReasonStillEmployedAnswer as HTMLElement)
    expect(changeReasonStillEmployedAnswer).toBeChecked()
    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()
    expect(queryForFinishDate()).toBeInTheDocument()

    await user.click(expectRecallYesAnswer as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallNoAnswer()).toBeInTheDocument()
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).toBeInTheDocument()
    expect(queryForIsSeasonalNoAnswer()).toBeInTheDocument()
    expect(queryForIsSeasonalYesAnswer()).toBeInTheDocument()
    expect(queryForRecallDate()).not.toBeInTheDocument()

    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForIsSeasonalNoAnswer()).toBeInTheDocument()
    expect(queryForIsSeasonalYesAnswer()).toBeInTheDocument()
    expect(queryForRecallDate()).toBeInTheDocument()
  })

  it('shows and clears Still Employed conditionals', async () => {
    const user = userEvent.setup()
    const {
      queryForChangeReasonLaidOffAnswer,
      queryForChangeReasonStillEmployedAnswer,
      queryForHoursReducedByEmployerAnswer,
      queryForReasonStillEmployedQuestion,
      queryForReduced20PercentQuestion,
      queryForReduced20PercentYesAnswer,
    } = renderChangeInEmployment()
    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const changeReasonStillEmployedAnswer =
      queryForChangeReasonStillEmployedAnswer()

    //click still employed should show 1 conditional
    await user.click(changeReasonStillEmployedAnswer as HTMLElement)
    expect(queryForReasonStillEmployedQuestion()).toBeInTheDocument()

    let hoursReducedByEmployerAnswer = queryForHoursReducedByEmployerAnswer()
    let reduced20PercentYesAnswer = queryForReduced20PercentYesAnswer()
    expect(reduced20PercentYesAnswer).not.toBeInTheDocument()

    // clicking hours_reduced_by_employer reveals 2nd conditional
    await user.click(hoursReducedByEmployerAnswer as HTMLElement)
    expect(hoursReducedByEmployerAnswer).toBeChecked()
    expect(queryForReduced20PercentQuestion()).toBeInTheDocument()

    reduced20PercentYesAnswer = queryForReduced20PercentYesAnswer()
    await user.click(reduced20PercentYesAnswer as HTMLElement)
    expect(reduced20PercentYesAnswer).toBeChecked()

    //clicking laid off should hide fields
    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()
    expect(queryForReduced20PercentQuestion()).not.toBeInTheDocument()
    expect(queryForReasonStillEmployedQuestion()).not.toBeInTheDocument()
    await user.click(changeReasonStillEmployedAnswer as HTMLElement)

    hoursReducedByEmployerAnswer = queryForHoursReducedByEmployerAnswer()

    //hours reduced should appear only after click and be cleared
    expect(queryForReduced20PercentQuestion()).not.toBeInTheDocument()
    await user.click(hoursReducedByEmployerAnswer as HTMLElement)
    expect(hoursReducedByEmployerAnswer).toBeChecked()
    expect(queryForReduced20PercentYesAnswer()).not.toBeChecked()
  })
  it('Clears Reduced Hours by 20 percent', async () => {
    const user = userEvent.setup()
    const {
      queryForChangeReasonStillEmployedAnswer,
      queryForHoursReducedByEmployerAnswer,
      queryForHoursReducedByClaimantAnswer,
      queryForReduced20PercentQuestion,
      queryForReduced20PercentYesAnswer,
      queryForReduced20PercentNoAnswer,
    } = renderChangeInEmployment()
    const changeReasonStillEmployedAnswer =
      queryForChangeReasonStillEmployedAnswer()

    //click still employed to show reduced hours
    await user.click(changeReasonStillEmployedAnswer as HTMLElement)
    const hoursReducedByEmployerAnswer = queryForHoursReducedByEmployerAnswer()

    //select hours reduced by employer and no to reduced hours
    await user.click(hoursReducedByEmployerAnswer as HTMLElement)
    let reduced20PercentNoAnswer = queryForReduced20PercentNoAnswer()
    await user.click(reduced20PercentNoAnswer as HTMLElement)
    expect(reduced20PercentNoAnswer).toBeChecked()
    const hoursReducedByClaimantAnswer = queryForHoursReducedByClaimantAnswer()

    //change still employed reason to hide reduced hours
    await user.click(hoursReducedByClaimantAnswer as HTMLElement)
    expect(hoursReducedByClaimantAnswer).toBeChecked()
    const reduced20PercentQuestion = queryForReduced20PercentQuestion()
    expect(reduced20PercentQuestion).not.toBeInTheDocument()

    //change reason back to hours reduced by employer, value should be cleared
    await user.click(hoursReducedByEmployerAnswer as HTMLElement)
    reduced20PercentNoAnswer = queryForReduced20PercentNoAnswer()
    const reduced20PercentYesAnswer = queryForReduced20PercentYesAnswer()

    expect(reduced20PercentNoAnswer).not.toBeChecked()
    expect(reduced20PercentYesAnswer).not.toBeChecked()
  })
  it('user can fill the base fields that are non-conditional to the main field', async () => {
    const user = userEvent.setup()
    const {
      queryForChangeReasonLaidOffAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      getDayStartDate,
      getMonthStartDate,
      getYearStartDate,
    } = renderChangeInEmployment()
    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const startDateDayField = getDayStartDate()
    const startDateMonthField = getMonthStartDate()
    const startDateYearField = getYearStartDate()
    const expectRecallNoAnswer = queryForExpectRecallNoAnswer()
    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()

    //radio fields can be clicked
    //TODO - fill in for other radio fields when they are added as well?
    expect(changeReasonLaidOffAnswer).not.toBeChecked()
    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()

    //enter start date
    expect(startDateDayField).toHaveValue('')
    expect(startDateMonthField).toHaveValue('')
    expect(startDateYearField).toHaveValue('')

    await user.type(startDateDayField, '01')
    await user.type(startDateMonthField, '06')
    await user.type(startDateYearField, '2023')

    expect(startDateDayField).toHaveValue('01')
    expect(startDateMonthField).toHaveValue('06')
    expect(startDateYearField).toHaveValue('2023')

    //check expect to be recalled (main question)
    expect(expectRecallNoAnswer).not.toBeChecked()
    expect(expectRecallYesAnswer).not.toBeChecked()

    await user.click(expectRecallNoAnswer as HTMLElement)
    expect(expectRecallNoAnswer).toBeChecked()
    expect(expectRecallYesAnswer).not.toBeChecked()

    await user.click(expectRecallYesAnswer as HTMLElement)
    expect(expectRecallNoAnswer).not.toBeChecked()
    expect(expectRecallYesAnswer).toBeChecked()
  })

  it('conditional fields show', async () => {
    const user = userEvent.setup()
    const {
      queryForExpectRecallYesAnswer,
      queryForHaveDefiniteDateOfRecallNoAnswer,
      queryForHaveDefiniteDateOfRecallYesAnswer,
      queryForIsSeasonalNoAnswer,
      queryForIsSeasonalYesAnswer,
      queryForRecallDate,
    } = renderChangeInEmployment()

    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()
    let haveDefiniteDateOfRecallNoAnswer =
      queryForHaveDefiniteDateOfRecallNoAnswer()
    let haveDefiniteDateOfRecallYesAnswer =
      queryForHaveDefiniteDateOfRecallYesAnswer()
    let isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    let isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    expect(haveDefiniteDateOfRecallNoAnswer).not.toBeInTheDocument()
    expect(haveDefiniteDateOfRecallYesAnswer).not.toBeInTheDocument()
    expect(isSeasonalNoAnswer).not.toBeInTheDocument()
    expect(isSeasonalYesAnswer).not.toBeInTheDocument()

    //definite date of recall yes/no question and seasonal should appear
    //the definite date of recall date field should still be hidden
    await user.click(expectRecallYesAnswer as HTMLElement)
    haveDefiniteDateOfRecallNoAnswer =
      queryForHaveDefiniteDateOfRecallNoAnswer()
    haveDefiniteDateOfRecallYesAnswer =
      queryForHaveDefiniteDateOfRecallYesAnswer()
    isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    expect(haveDefiniteDateOfRecallNoAnswer).toBeInTheDocument()
    expect(haveDefiniteDateOfRecallYesAnswer).toBeInTheDocument()
    expect(isSeasonalNoAnswer).toBeInTheDocument()
    expect(isSeasonalYesAnswer).toBeInTheDocument()

    //recall date field
    let definiteRecallDate = queryForRecallDate()
    expect(definiteRecallDate).not.toBeInTheDocument()

    //should show date field and date field should remain visible
    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).toBeChecked()
    definiteRecallDate = queryForRecallDate()
    isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    expect(isSeasonalNoAnswer).toBeInTheDocument()
    expect(isSeasonalYesAnswer).toBeInTheDocument()
    expect(definiteRecallDate).toBeInTheDocument()
  })
  it('fills and clears last day of work', async () => {
    const user = userEvent.setup()
    const {
      queryForChangeReasonLaidOffAnswer,
      getDayLastDate,
      getMonthLastDate,
      getYearLastDate,
    } = renderChangeInEmployment()
    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()

    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(queryForChangeReasonLaidOffAnswer()).toBeChecked()
    const lastDayOfWorkDayField = getDayLastDate()
    const lastDayOfWorkMonthField = getMonthLastDate()
    const lastDayOfWorkYearField = getYearLastDate()
    await user.type(lastDayOfWorkDayField, '01')
    await user.type(lastDayOfWorkMonthField, '06')
    await user.type(lastDayOfWorkYearField, '2023')

    expect(lastDayOfWorkDayField).toHaveValue('01')
    expect(lastDayOfWorkMonthField).toHaveValue('06')
    expect(lastDayOfWorkYearField).toHaveValue('2023')
  })
  it('fills and clears recall conditionals', async () => {
    const user = userEvent.setup()
    const {
      queryForChangeReasonLaidOffAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForHaveDefiniteDateOfRecallNoAnswer,
      queryForHaveDefiniteDateOfRecallYesAnswer,
      queryForIsSeasonalNoAnswer,
      queryForIsSeasonalYesAnswer,
      queryForRecallDate,
      getMonthRecallDate,
      getDayRecallDate,
      getYearRecallDate,
    } = renderChangeInEmployment()

    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()

    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(queryForChangeReasonLaidOffAnswer()).toBeChecked()

    await user.click(queryForExpectRecallYesAnswer() as HTMLElement)
    expect(queryForChangeReasonLaidOffAnswer()).toBeChecked()
    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).toBeChecked()
    expect(queryForRecallDate()).toBeInTheDocument()

    await user.type(getMonthRecallDate(), '01')
    await user.type(getDayRecallDate(), '06')
    await user.type(getYearRecallDate(), '2023')

    expect(getMonthRecallDate()).toHaveValue('01')
    expect(getDayRecallDate()).toHaveValue('06')
    expect(getYearRecallDate()).toHaveValue('2023')

    await user.click(queryForIsSeasonalYesAnswer() as HTMLElement)
    expect(queryForIsSeasonalYesAnswer()).toBeChecked()

    //should clear all date fields
    await user.click(queryForHaveDefiniteDateOfRecallNoAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallNoAnswer()).toBeChecked()
    expect(queryForRecallDate()).not.toBeInTheDocument()

    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)

    //check if cleared appropriately
    expect(getMonthRecallDate()).toHaveValue('')
    expect(getDayRecallDate()).toHaveValue('')
    expect(getYearRecallDate()).toHaveValue('')

    //reset values
    await user.type(getMonthRecallDate(), '01')
    await user.type(getDayRecallDate(), '06')
    await user.type(getYearRecallDate(), '2023')

    await user.click(queryForExpectRecallNoAnswer() as HTMLElement)
    expect(queryForExpectRecallNoAnswer()).toBeChecked()
    expect(queryForIsSeasonalYesAnswer()).not.toBeInTheDocument()
    expect(queryForIsSeasonalNoAnswer()).not.toBeInTheDocument()
    expect(queryForRecallDate()).not.toBeInTheDocument()
    await user.click(queryForExpectRecallYesAnswer() as HTMLElement)

    expect(queryForExpectRecallYesAnswer()).toBeChecked()
    expect(queryForIsSeasonalNoAnswer()).not.toBeChecked()
    expect(queryForIsSeasonalYesAnswer()).not.toBeChecked()
    expect(queryForHaveDefiniteDateOfRecallNoAnswer()).not.toBeChecked()
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).not.toBeChecked()

    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(getMonthRecallDate()).toHaveValue('')
    expect(getDayRecallDate()).toHaveValue('')
    expect(getYearRecallDate()).toHaveValue('')
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
