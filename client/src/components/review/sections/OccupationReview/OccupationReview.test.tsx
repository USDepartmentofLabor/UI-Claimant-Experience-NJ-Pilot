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
    const occocoderTitle = screen.queryByRole('group', {
      name: 'occupation.occucoder_code.label',
    })

    return {
      jobTitle,
      jobDescription,
      occocoderTitle,
    }
  }

  it('renders correctly', () => {
    const values = {
      job_title: 'Software Engineer',
      job_description: 'Lots of Googling',
      occucoder_code: '1234',
      occucoder_job_title: 'Software Engineer',
    }

    const { jobTitle, jobDescription, occocoderTitle } =
      renderOccupationReview(values)

    expect(jobTitle[0]).toHaveTextContent(values.job_title)
    expect(jobDescription[0]).toHaveTextContent(values.job_description)
    expect(occocoderTitle).toHaveTextContent(values.occucoder_job_title)
  })

  it('renders correctly when no occucoder code is present', () => {
    const { occocoderTitle } = renderOccupationReview()

    expect(occocoderTitle).not.toBeInTheDocument()
  })
})
