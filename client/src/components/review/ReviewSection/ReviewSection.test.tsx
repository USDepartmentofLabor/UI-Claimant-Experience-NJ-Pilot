import { render, screen, within } from '@testing-library/react'
import { ReviewSection } from 'components/review/ReviewSection/ReviewSection'
import { ReactNode } from 'react'

const HEADING = 'heading'
const EDIT_URL = '/go/to/the/page/please'
const CHILDREN = 'children'

describe('ReviewSection component', () => {
  const renderReviewSection = (
    headingText: string,
    editUrl?: string,
    children?: ReactNode
  ) => {
    render(
      <ReviewSection heading={headingText} editUrl={editUrl}>
        {children}
      </ReviewSection>
    )

    const section = screen.getByRole('region')
    const heading = within(section).getByRole('heading', { name: headingText })
    const queryForEditLink = () =>
      editUrl === undefined
        ? null
        : within(section).queryByRole('link', {
            name: 'review.edit.accessible_name',
          })

    return {
      section,
      heading,
      queryForEditLink,
    }
  }

  it('Renders correctly', () => {
    const { section, heading, queryForEditLink } = renderReviewSection(
      HEADING,
      EDIT_URL,
      CHILDREN
    )

    const editLink = queryForEditLink()
    const children = within(section).queryByText(CHILDREN)

    expect(heading).toBeInTheDocument()
    expect(editLink).toBeInTheDocument()
    expect(children).toBeInTheDocument()
  })

  it('Does not render a link if URL is not provided', () => {
    const { heading, queryForEditLink } = renderReviewSection(HEADING)

    const editLink = queryForEditLink()

    expect(heading).toBeInTheDocument()
    expect(editLink).not.toBeInTheDocument()
  })
})
