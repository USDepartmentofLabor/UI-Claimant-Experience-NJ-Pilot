import { render, screen, within } from '@testing-library/react'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'

const LABEL = 'label'
const VALUE = 'value'

describe('ReviewElement component', () => {
  const renderReviewElement = (label: string, value: string | undefined) => {
    render(<ReviewElement label={label} value={value} />)

    const queryForFieldset = () => screen.queryByRole('group', { name: label })
    const queryForLabel = () => {
      const fieldset = queryForFieldset()
      if (fieldset) {
        return within(fieldset).queryByText(label)
      } else {
        return null
      }
    }
    const queryForValue = () => {
      const fieldset = queryForFieldset()
      if (fieldset && value) {
        return within(fieldset).queryByText(value)
      } else {
        return null
      }
    }

    return {
      queryForFieldset,
      queryForLabel,
      queryForValue,
    }
  }

  it('Renders correctly', () => {
    const { queryForLabel, queryForValue } = renderReviewElement(LABEL, VALUE)

    const label = queryForLabel()
    const value = queryForValue()

    expect(label).toBeInTheDocument()
    expect(value).toBeInTheDocument()
    expect(value).toHaveTextContent(VALUE)
  })

  it('Renders nothing if the value is undefined', () => {
    const { queryForFieldset, queryForLabel, queryForValue } =
      renderReviewElement(LABEL, undefined)

    const fieldset = queryForFieldset()
    const label = queryForLabel()
    const value = queryForValue()

    expect(fieldset).not.toBeInTheDocument()
    expect(label).not.toBeInTheDocument()
    expect(value).not.toBeInTheDocument()
  })
})
