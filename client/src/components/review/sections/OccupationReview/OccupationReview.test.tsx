import { render, screen } from '@testing-library/react'
import { OccupationReview } from 'components/review/sections/OccupationReview/OccupationReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

describe('OccupationReview component', () => {
  const renderOccupationReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <OccupationReview />
      </ClaimFormContext.Provider>
    )

    const jobTitle = screen.queryAllByRole('group', {
      name: 'occupation.job_title.label',
    })
    const jobDescription = screen.queryAllByRole('group', {
      name: 'occupation.job_description.label',
    })

    return {
      jobTitle,
      jobDescription,
    }
  }

  it('renders correctly', () => {
    const values = {
      job_title: 'Software Engineer',
      job_description: 'Lots of Googling',
    }

    const { jobTitle, jobDescription } = renderOccupationReview(values)

    expect(jobTitle[0]).toHaveTextContent(values.job_title)
    expect(jobDescription[0]).toHaveTextContent(values.job_description)
  })
})
