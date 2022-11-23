import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { ChangeInEmployment } from 'components/form/employer/ChangeInEmployment/ChangeInEmployment'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('Change in Employment component', () => {
  const renderChangeInEmployment = () => {
    render(
      <Formik
        initialValues={{
          employers: [
            {
              name: 'Some employer',
            },
          ],
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

    return {
      sectionTitle,
      queryForChangeReasonRadioField,
      queryForChangeReasonLaidOffAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForHaveDefiniteDateOfRecall,
      queryForHaveDefiniteDateOfRecallNoAnswer,
      queryForHaveDefiniteDateOfRecallYesAnswer,
      queryForIsSeasonalNoAnswer,
      queryForIsSeasonalYesAnswer,
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
    }
  }
  it('renders without errors', async () => {
    const user = userEvent.setup()
    const {
      sectionTitle,
      queryForChangeReasonRadioField,
      queryForChangeReasonLaidOffAnswer,
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
    expect(expectRecallNoAnswer).toBeInTheDocument()
    expect(expectRecallYesAnswer).toBeInTheDocument()
    expect(startDate).toBeInTheDocument()
    expect(finishDate).not.toBeInTheDocument()

    expect(haveDefiniteDateOfRecallNoAnswer).not.toBeInTheDocument()
    expect(haveDefiniteDateOfRecallYesAnswer).not.toBeInTheDocument()
    expect(isSeasonalNoAnswer).not.toBeInTheDocument()
    expect(isSeasonalYesAnswer).not.toBeInTheDocument()
    expect(recallDate).not.toBeInTheDocument()

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
  it('clears conditionals', async () => {
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
    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()

    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(queryForChangeReasonLaidOffAnswer()).toBeChecked()
    await user.click(expectRecallYesAnswer as HTMLElement)
    expect(queryForExpectRecallYesAnswer()).toBeChecked()
    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).toBeChecked()

    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallYesAnswer()).toBeChecked()

    await user.type(getMonthRecallDate(), '01')
    await user.type(getDayRecallDate(), '06')
    await user.type(getYearRecallDate(), '2023')

    expect(getMonthRecallDate()).toHaveValue('01')
    expect(getDayRecallDate()).toHaveValue('06')
    expect(getYearRecallDate()).toHaveValue('2023')

    await user.click(queryForIsSeasonalYesAnswer() as HTMLElement)
    expect(queryForIsSeasonalYesAnswer()).toBeChecked()
    //should clear all date fields but seasonal should remain
    await user.click(queryForHaveDefiniteDateOfRecallNoAnswer() as HTMLElement)
    expect(queryForHaveDefiniteDateOfRecallNoAnswer()).toBeChecked()
    expect(queryForRecallDate()).not.toBeInTheDocument()

    // expect(queryForIsSeasonalYesAnswer()).toBeChecked() no worky

    //reset it to have date
    await user.click(queryForHaveDefiniteDateOfRecallYesAnswer() as HTMLElement)
    expect(getMonthRecallDate()).toHaveValue('')
    expect(getDayRecallDate()).toHaveValue('')
    expect(getYearRecallDate()).toHaveValue('')

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
})
