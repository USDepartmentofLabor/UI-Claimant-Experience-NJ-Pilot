import { render, screen } from '@testing-library/react'
import { EducationAndTrainingReview } from 'components/review/sections/EducationAndTrainingReview/EducationAndTrainingReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'

describe('EducationAndTrainingReview component', () => {
  const renderEducationAndTrainingReview = (
    claimFormValues: ClaimantInput = {}
  ) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <EducationAndTrainingReview />
      </ClaimFormContext.Provider>
    )

    const attendingCollegeOrJobTraining = screen.queryAllByRole('group', {
      name: 'education_and_training.attending_training.label',
    })
    const trainingThroughHiringHallOrCareerCenter = screen.queryAllByRole(
      'group',
      {
        name: 'education_and_training.training_through_hiring_hall_or_career_center.label',
      }
    )

    return {
      attendingCollegeOrJobTraining,
      trainingThroughHiringHallOrCareerCenter,
    }
  }

  it('renders correctly', () => {
    const values = {
      attending_college_or_job_training: true,
      training_through_hiring_hall_or_career_center: true,
    }

    const {
      attendingCollegeOrJobTraining,
      trainingThroughHiringHallOrCareerCenter,
    } = renderEducationAndTrainingReview(values)

    expect(attendingCollegeOrJobTraining[0]).toHaveTextContent('yes')
    expect(trainingThroughHiringHallOrCareerCenter[0]).toHaveTextContent('yes')
  })

  it('does not render second question if user answers "no" on attending college or training', () => {
    const values = {
      attending_college_or_job_training: false,
    }

    const {
      attendingCollegeOrJobTraining,
      trainingThroughHiringHallOrCareerCenter,
    } = renderEducationAndTrainingReview(values)

    expect(attendingCollegeOrJobTraining[0]).toHaveTextContent('no')
    expect(trainingThroughHiringHallOrCareerCenter.length).toBe(0)
  })
})
