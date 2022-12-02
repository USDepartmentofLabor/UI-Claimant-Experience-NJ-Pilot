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

    const queryForChangeReasonQuitOrRetiredAnswer = () =>
      screen.getByTestId('employers[0].separation_circumstance.quit_or_retired')

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
      queryForChangeReasonFiredDischargedSuspendedAnswer,
      queryForChangeReasonQuitOrRetiredAnswer,
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
  const checkShouldBeInDocument = (elements: (HTMLElement | null)[]) => {
    elements.forEach((q: HTMLElement | null) => {
      expect(q).toBeInTheDocument()
    })
  }
  const checkShouldNotBeInDocument = (
    absentElements: (HTMLElement | null)[]
  ) => {
    absentElements?.forEach((q: HTMLElement | null) => {
      expect(q).not.toBeInTheDocument()
    })
  }
  const checkShouldHaveEmptyValue = (elements: (HTMLElement | null)[]) => {
    elements.forEach((field: HTMLElement | null) => {
      expect(field).toHaveValue('')
    })
  }

  it('renders without errors', async () => {
    const user = userEvent.setup()
    const {
      sectionTitle,
      queryForChangeReasonRadioField,
      queryForChangeReasonLaidOffAnswer,
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

    checkShouldBeInDocument([
      sectionTitle,
      changeReasonRadioField,
      changeReasonLaidOffAnswer,
      changeReasonFiredDischargedSuspendedAnswer,
      expectRecallNoAnswer,
      expectRecallYesAnswer,
      startDate,
    ])

    checkShouldNotBeInDocument([
      finishDate,
      haveDefiniteDateOfRecallNoAnswer,
      haveDefiniteDateOfRecallYesAnswer,
      isSeasonalNoAnswer,
      isSeasonalYesAnswer,
      recallDate,
    ])

    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()
    expect(queryForFinishDate()).toBeInTheDocument()

    await user.click(expectRecallYesAnswer as HTMLElement)
    checkShouldBeInDocument([
      queryForHaveDefiniteDateOfRecallNoAnswer(),
      queryForHaveDefiniteDateOfRecallYesAnswer(),
      queryForIsSeasonalNoAnswer(),
      queryForIsSeasonalYesAnswer(),
    ])
    expect(queryForRecallDate()).not.toBeInTheDocument()

    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForIsSeasonalNoAnswer()).toBeInTheDocument()
    expect(queryForIsSeasonalYesAnswer()).toBeInTheDocument()
    expect(queryForRecallDate()).toBeInTheDocument()
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
    checkShouldHaveEmptyValue([
      startDateDayField,
      startDateMonthField,
      startDateYearField,
    ])

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
      queryForChangeReasonLaidOffAnswer,
      queryForExpectRecallYesAnswer,
      queryForHaveDefiniteDateOfRecallNoAnswer,
      queryForHaveDefiniteDateOfRecallYesAnswer,
      queryForIsSeasonalNoAnswer,
      queryForIsSeasonalYesAnswer,
      queryForFinishDate,
      queryForRecallDate,
    } = renderChangeInEmployment()

    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()
    let finishDate = queryForFinishDate()

    //laid off should trigger finished date to show
    expect(finishDate).not.toBeInTheDocument()
    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()

    finishDate = queryForFinishDate()
    expect(finishDate).toBeInTheDocument()

    let haveDefiniteDateOfRecallNoAnswer =
      queryForHaveDefiniteDateOfRecallNoAnswer()
    let haveDefiniteDateOfRecallYesAnswer =
      queryForHaveDefiniteDateOfRecallYesAnswer()
    let isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    let isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    checkShouldNotBeInDocument([
      haveDefiniteDateOfRecallNoAnswer,
      haveDefiniteDateOfRecallYesAnswer,
      isSeasonalNoAnswer,
      isSeasonalYesAnswer,
    ])

    //definite date of recall yes/no question and seasonal should appear
    //the definite date of recall date field should still be hidden
    await user.click(expectRecallYesAnswer as HTMLElement)
    haveDefiniteDateOfRecallNoAnswer =
      queryForHaveDefiniteDateOfRecallNoAnswer()
    haveDefiniteDateOfRecallYesAnswer =
      queryForHaveDefiniteDateOfRecallYesAnswer()
    isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    checkShouldBeInDocument([
      haveDefiniteDateOfRecallNoAnswer,
      haveDefiniteDateOfRecallYesAnswer,
      isSeasonalNoAnswer,
      isSeasonalYesAnswer,
    ])

    //recall date field
    let definiteRecallDate = queryForRecallDate()
    expect(definiteRecallDate).not.toBeInTheDocument()

    //should show date field and date field should remain visible
    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).toBeChecked()
    definiteRecallDate = queryForRecallDate()
    isSeasonalNoAnswer = queryForIsSeasonalNoAnswer()
    isSeasonalYesAnswer = queryForIsSeasonalYesAnswer()

    checkShouldBeInDocument([
      isSeasonalNoAnswer,
      isSeasonalYesAnswer,
      definiteRecallDate,
    ])
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

    /*TODO - should be filled in here with reseting the last day field if
    the radio is unchecked
    Fill in when still-employed is added in.
    Change the const values above to be let and reassign
    */
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
    checkShouldHaveEmptyValue([
      getMonthRecallDate(),
      getDayRecallDate(),
      getYearRecallDate(),
    ])

    //reset values
    await user.type(getMonthRecallDate(), '01')
    await user.type(getDayRecallDate(), '06')
    await user.type(getYearRecallDate(), '2023')

    await user.click(queryForExpectRecallNoAnswer() as HTMLElement)
    expect(queryForExpectRecallNoAnswer()).toBeChecked()
    checkShouldNotBeInDocument([
      queryForIsSeasonalYesAnswer(),
      queryForIsSeasonalNoAnswer(),
      queryForRecallDate(),
    ])

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
    checkShouldHaveEmptyValue([
      queryForSeparationCircumstanceDetails(),
      getMonthDischargeDate(),
      getDayDischargeDate(),
      getYearDischargeDate(),
    ])
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
    checkShouldHaveEmptyValue([
      queryForSeparationCircumstanceDetails(),
      getMonthDischargeDate(),
      getDayDischargeDate(),
      getYearDischargeDate(),
    ])
  })
  describe('Quit resigned or retired selected', () => {
    it('shows appropriate fields', async () => {
      const user = userEvent.setup()
      const {
        queryForChangeReasonQuitOrRetiredAnswer,
        queryForSeparationCircumstanceDetails,
        queryForStartDate,
        queryForFinishDate,
      } = renderChangeInEmployment()

      const changeReasonQuitOrRetired =
        queryForChangeReasonQuitOrRetiredAnswer()
      await user.click(changeReasonQuitOrRetired)
      expect(changeReasonQuitOrRetired).toBeChecked()
      checkShouldBeInDocument([
        queryForSeparationCircumstanceDetails(),
        queryForStartDate(),
        queryForFinishDate(),
      ])
    })
    it('clears textbox when different change reason is selected', async () => {
      const user = userEvent.setup()
      const {
        queryForChangeReasonQuitOrRetiredAnswer,
        queryForChangeReasonLaidOffAnswer,
        queryForSeparationCircumstanceDetails,
      } = renderChangeInEmployment()
      const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
      const changeReasonQuitOrRetired =
        queryForChangeReasonQuitOrRetiredAnswer()
      await user.click(changeReasonQuitOrRetired)

      const detail = 'I am a reasonable reason'
      await user.type(queryForSeparationCircumstanceDetails(), detail)
      expect(screen.getByText(detail)).toBeInTheDocument()
      await user.click(changeReasonLaidOffAnswer)
      expect(changeReasonQuitOrRetired).not.toBeChecked()
      await user.click(changeReasonQuitOrRetired)
      expect(screen.queryByText(detail)).not.toBeInTheDocument()
    })
  })
})
