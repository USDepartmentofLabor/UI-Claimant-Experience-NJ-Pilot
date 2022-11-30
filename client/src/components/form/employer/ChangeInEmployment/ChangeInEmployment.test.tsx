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
    const queryForStartDate = () =>
      screen.queryByText('employment_start_date.label')
    const queryForFinishDate = () =>
      screen.queryByText('employment_last_date.label')
    return {
      sectionTitle,
      queryForChangeReasonRadioField,
      queryForChangeReasonLaidOffAnswer,
      queryForChangeReasonStillEmployedAnswer,
      queryForHoursReducedByEmployerAnswer,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForReasonStillEmployedQuestion,
      queryForReduced20PercentQuestion,
      queryForReduced20PercentYesAnswer,
      queryForReduced20PercentNoAnswer,
      queryForStartDate,
      queryForFinishDate,
    }
  }
  it('renders without errors', async () => {
    const user = userEvent.setup()
    const {
      sectionTitle,
      queryForChangeReasonLaidOffAnswer,
      queryForChangeReasonStillEmployedAnswer,
      queryForChangeReasonRadioField,
      queryForExpectRecallNoAnswer,
      queryForExpectRecallYesAnswer,
      queryForStartDate,
      queryForFinishDate,
    } = renderChangeInEmployment()
    const changeReasonRadioField = queryForChangeReasonRadioField()
    const changeReasonLaidOffAnswer = queryForChangeReasonLaidOffAnswer()
    const changeReasonStillEmployedAnswer =
      queryForChangeReasonStillEmployedAnswer()
    const expectRecallNoAnswer = queryForExpectRecallNoAnswer()
    const expectRecallYesAnswer = queryForExpectRecallYesAnswer()
    const startDate = queryForStartDate()
    const finishDate = queryForFinishDate()

    expect(sectionTitle).toBeInTheDocument()
    expect(changeReasonRadioField).toBeInTheDocument()
    expect(changeReasonLaidOffAnswer).toBeInTheDocument()
    expect(expectRecallNoAnswer).toBeInTheDocument()
    expect(expectRecallYesAnswer).toBeInTheDocument()
    expect(startDate).toBeInTheDocument()
    expect(finishDate).not.toBeInTheDocument()

    await user.click(changeReasonLaidOffAnswer as HTMLElement)
    expect(changeReasonLaidOffAnswer).toBeChecked()
    expect(queryForFinishDate()).toBeInTheDocument()

    await user.click(changeReasonStillEmployedAnswer as HTMLElement)
    expect(changeReasonStillEmployedAnswer).toBeChecked()
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
})
