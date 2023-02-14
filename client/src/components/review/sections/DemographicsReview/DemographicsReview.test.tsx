import { render, screen } from '@testing-library/react'
import { DemographicsReview } from './DemographicsReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import {
  EducationLevelOption,
  EthnicityOption,
  RaceOption,
  SexOption,
} from 'constants/formOptions'

describe('DemographicsReview component', () => {
  const renderDemographicsReview = (claimFormValues: ClaimantInput = {}) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <DemographicsReview />
      </ClaimFormContext.Provider>
    )

    const sex = screen.queryAllByRole('group', {
      name: 'sex.label',
    })
    const ethnicity = screen.queryAllByRole('group', {
      name: 'ethnicity.label',
    })
    const race = screen.queryAllByRole('group', {
      name: 'race.label',
    })
    const educationLevel = screen.queryAllByRole('group', {
      name: 'education_level.label',
    })
    return { sex, ethnicity, race, educationLevel }
  }
  it('renders with the correct values', () => {
    const values = {
      sex: 'male' as SexOption,
      race: 'opt_out' as RaceOption,
      ethnicity: 'opt_out' as EthnicityOption,
      education_level: 'none' as EducationLevelOption,
    }
    const { sex, ethnicity, race, educationLevel } =
      renderDemographicsReview(values)

    expect(sex.length).toBe(1)
    expect(ethnicity.length).toBe(1)
    expect(race.length).toBe(1)
    expect(educationLevel.length).toBe(1)
    expect(sex[0]).toHaveTextContent(`sex.options.${values.sex}`)
    expect(ethnicity[0]).toHaveTextContent(
      `ethnicity.options.${values.ethnicity}`
    )
    expect(race[0]).toHaveTextContent(`race.options.${values.race}`)
    expect(educationLevel[0]).toHaveTextContent(
      `education_level.options.${values.education_level}`
    )
  })
})
