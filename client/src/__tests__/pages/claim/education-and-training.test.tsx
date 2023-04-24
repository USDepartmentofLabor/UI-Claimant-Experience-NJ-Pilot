import { render, screen, within } from '@testing-library/react'
import EducationAndTraining from 'pages/claim/education-and-training'
import userEvent from '@testing-library/user-event'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('EducationAndTraining component', () => {
  it('renders properly', () => {
    render(<EducationAndTraining />)

    expect(
      screen.getByText('education_and_training.attending_training.label')
    ).toBeInTheDocument()
  })

  it('shows/hides training_through_hiring_hall_or_career_center', async () => {
    const user = userEvent.setup()
    render(<EducationAndTraining />)

    const currentlyAttendingTrainingFormGroup = screen.getByRole('group', {
      name: 'education_and_training.attending_training.label',
    })
    const currentlyAttendingTrainingYes = within(
      currentlyAttendingTrainingFormGroup
    ).getByText('yes')
    const currentlyAttendingTrainingNo = within(
      currentlyAttendingTrainingFormGroup
    ).getByText('no')

    expect(
      screen.queryByRole('group', {
        name: 'education_and_training.training_through_hiring_hall_or_career_center.label',
      })
    ).not.toBeInTheDocument()

    await user.click(currentlyAttendingTrainingYes)

    const trainingThroughHiringHallOrCareerCenterFormGroup =
      await screen.findByRole('group', {
        name: 'education_and_training.training_through_hiring_hall_or_career_center.label',
      })

    expect(trainingThroughHiringHallOrCareerCenterFormGroup).toBeInTheDocument()

    await user.click(currentlyAttendingTrainingNo)

    expect(
      trainingThroughHiringHallOrCareerCenterFormGroup
    ).not.toBeInTheDocument()
  })

  // TODO: add validation tests, fixtures and functions when pages are more flushed out
  // describe('validations', () => {
  //   describe('valid answers', () => {
  //     it.concurrent.each(
  //       getValidClaimFormFixtures('education-vocational-rehab')
  //     )('passes with valid values: %o', (formData) => {
  //       const { t } = useTranslation('claimForm')
  //       const schema = EducationAndTrainingPageDefinition.pageSchema(t)
  //
  //       expect(schema.isValidSync(formData)).toBeTruthy()
  //     })
  //   })
  //
  //   describe('invalid answers', () => {
  //     it.concurrent.each(
  //       getInvalidClaimFormFixtures('education-vocational-rehab')
  //     )('fails with invalid values: %o', (formData) => {
  //       const { t } = useTranslation('claimForm')
  //       const schema = EducationAndTrainingPageDefinition.pageSchema(t)
  //
  //       expect(schema.isValidSync(formData)).toBeFalsy()
  //     })
  //   })
  // })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = EducationAndTraining
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
