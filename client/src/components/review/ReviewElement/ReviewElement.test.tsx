import { render, screen, within } from '@testing-library/react'
import { ReviewElement } from 'components/review/ReviewElement/ReviewElement'
import userEvent from '@testing-library/user-event'

const LABEL = 'label'
const VALUE = 'value'

describe('ReviewElement component', () => {
  const renderReviewElement = (
    label: string,
    value: string | null | undefined,
    maskable?: boolean,
    defaultMasked?: boolean
  ) => {
    render(
      <ReviewElement
        label={label}
        value={value}
        maskable={maskable}
        defaultMasked={defaultMasked}
      />
    )

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

    const queryForMaskToggleButton = () => {
      const fieldset = queryForFieldset()
      if (fieldset) {
        return within(fieldset).queryByRole('button')
      } else {
        return null
      }
    }

    return {
      queryForFieldset,
      queryForLabel,
      queryForValue,
      queryForMaskToggleButton,
    }
  }

  it('Renders correctly', () => {
    const { queryForLabel, queryForValue, queryForMaskToggleButton } =
      renderReviewElement(LABEL, VALUE)

    const label = queryForLabel()
    const value = queryForValue()
    const toggleButton = queryForMaskToggleButton()

    expect(label).toBeInTheDocument()
    expect(value).toBeInTheDocument()
    expect(value).toHaveTextContent(VALUE)
    expect(toggleButton).not.toBeInTheDocument()
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

  it('Renders nothing if the value is null', () => {
    const { queryForFieldset, queryForLabel, queryForValue } =
      renderReviewElement(LABEL, null)

    const fieldset = queryForFieldset()
    const label = queryForLabel()
    const value = queryForValue()

    expect(fieldset).not.toBeInTheDocument()
    expect(label).not.toBeInTheDocument()
    expect(value).not.toBeInTheDocument()
  })

  it('Renders nothing if the value is empty', () => {
    const { queryForFieldset, queryForLabel, queryForValue } =
      renderReviewElement(LABEL, '')

    const fieldset = queryForFieldset()
    const label = queryForLabel()
    const value = queryForValue()

    expect(fieldset).not.toBeInTheDocument()
    expect(label).not.toBeInTheDocument()
    expect(value).not.toBeInTheDocument()
  })

  describe('maskable behavior', () => {
    it('Renders maskable', () => {
      const valueToMask = 'a value that should be masked'
      const {
        queryForFieldset,
        queryForLabel,
        queryForValue,
        queryForMaskToggleButton,
      } = renderReviewElement(LABEL, valueToMask, true)

      const fieldset = queryForFieldset()
      const label = queryForLabel()
      const value = queryForValue()
      const toggleButton = queryForMaskToggleButton()

      expect(fieldset).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(value).not.toBeInTheDocument()
      expect(toggleButton).toBeInTheDocument()
    })

    it('Allows maskable field to be toggled', async () => {
      const user = userEvent.setup()

      const valueToMask = 'a value that should be masked'
      const maskedValue = '•'.repeat(valueToMask.length)
      const {
        queryForFieldset,
        queryForLabel,
        queryForValue,
        queryForMaskToggleButton,
      } = renderReviewElement(LABEL, valueToMask, true)

      const fieldset = queryForFieldset()
      const label = queryForLabel()
      const toggleButton = queryForMaskToggleButton()

      // Value is masked by default
      expect(fieldset).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(queryForValue()).not.toBeInTheDocument()
      expect(screen.queryByText(maskedValue)).toBeInTheDocument()
      expect(toggleButton).toBeInTheDocument()

      // Value is shown when toggled
      await user.click(toggleButton as HTMLElement)

      expect(queryForValue()).toBeInTheDocument()
      expect(screen.queryByText(maskedValue)).not.toBeInTheDocument()

      // Value is hidden when toggled again
      await user.click(toggleButton as HTMLElement)

      expect(queryForValue()).not.toBeInTheDocument()
      expect(screen.queryByText(maskedValue)).toBeInTheDocument()
    })

    it('Allows maskable field to be rendered unmasked and toggled', async () => {
      const user = userEvent.setup()

      const valueToMask = 'a value that should be masked'
      const maskedValue = '•'.repeat(valueToMask.length)
      const {
        queryForFieldset,
        queryForLabel,
        queryForValue,
        queryForMaskToggleButton,
      } = renderReviewElement(LABEL, valueToMask, true, false)

      const fieldset = queryForFieldset()
      const label = queryForLabel()
      const toggleButton = queryForMaskToggleButton()

      // Value is unmasked by default
      expect(fieldset).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      expect(queryForValue()).toBeInTheDocument()
      expect(screen.queryByText(maskedValue)).not.toBeInTheDocument()
      expect(toggleButton).toBeInTheDocument()

      // Value is masked when toggled
      await user.click(toggleButton as HTMLElement)

      expect(queryForValue()).not.toBeInTheDocument()
      expect(screen.queryByText(maskedValue)).toBeInTheDocument()

      // Value is unmasked when toggled again
      await user.click(toggleButton as HTMLElement)

      expect(queryForValue()).toBeInTheDocument()
      expect(screen.queryByText(maskedValue)).not.toBeInTheDocument()
    })
  })
})
