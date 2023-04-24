import { render, screen, within } from '@testing-library/react'
import { ReviewYesNo } from 'components/review/ReviewYesNo/ReviewYesNo'

const LABEL = 'label'

describe('ReviewYesNo component', () => {
  const renderReviewYesNo = (label: string, value: boolean | undefined) => {
    render(<ReviewYesNo label={label} value={value} />)

    const queryForFieldset = () => screen.queryByRole('group', { name: label })
    const queryForLabel = () => {
      const fieldset = queryForFieldset()
      if (fieldset) {
        return within(fieldset).queryByText(label)
      } else {
        return null
      }
    }
    const queryForYesAnswer = () => screen.queryByText('yes')
    const queryForNoAnswer = () => screen.queryByText('no')

    return {
      queryForFieldset,
      queryForLabel,
      queryForYesAnswer,
      queryForNoAnswer,
    }
  }

  it('Renders correctly with true value', () => {
    const { queryForLabel, queryForYesAnswer, queryForNoAnswer } =
      renderReviewYesNo(LABEL, true)

    const label = queryForLabel()
    const yes = queryForYesAnswer()
    const no = queryForNoAnswer()

    expect(label).toBeInTheDocument()
    expect(yes).toBeInTheDocument()
    expect(no).not.toBeInTheDocument()
  })

  it('Renders correctly with false value', () => {
    const { queryForLabel, queryForYesAnswer, queryForNoAnswer } =
      renderReviewYesNo(LABEL, false)

    const label = queryForLabel()
    const yes = queryForYesAnswer()
    const no = queryForNoAnswer()

    expect(label).toBeInTheDocument()
    expect(yes).not.toBeInTheDocument()
    expect(no).toBeInTheDocument()
  })

  it('Renders correctly with an undefined value', () => {
    const {
      queryForFieldset,
      queryForLabel,
      queryForYesAnswer,
      queryForNoAnswer,
    } = renderReviewYesNo(LABEL, undefined)

    const fieldset = queryForFieldset()
    const label = queryForLabel()
    const yes = queryForYesAnswer()
    const no = queryForNoAnswer()

    expect(fieldset).not.toBeInTheDocument()
    expect(label).not.toBeInTheDocument()
    expect(yes).not.toBeInTheDocument()
    expect(no).not.toBeInTheDocument()
  })
})
