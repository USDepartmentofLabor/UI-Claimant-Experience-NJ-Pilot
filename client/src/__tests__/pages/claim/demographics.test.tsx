import { render, within } from '@testing-library/react'
import { Formik } from 'formik'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import Demographics from 'pages/claim/demographics'
import { noop } from 'helpers/noop/noop'
// import {
//   getInvalidClaimFormFixtures,
//   getValidClaimFormFixtures,
// } from "../../../testUtils/fixtures";
import {
  educationLevelOptions,
  ethnicityOptions,
  raceOptions,
  sexOptions,
} from 'constants/formOptions'

describe('Demographics page', () => {
  const initialValues = {
    sex: undefined,
    race: [],
    ethnicity: undefined,
    education_level: undefined,
  }

  it('renders properly', () => {
    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Demographics />
      </Formik>
    )

    sexOptions.forEach((option) => {
      const sexRadio = screen.getByRole('radio', {
        name: `sex.options.${option}`,
      })
      expect(sexRadio).not.toBeChecked()
    })

    raceOptions.forEach((race) => {
      const raceCheckbox = getByLabelText(`race.options.${race}`)
      expect(raceCheckbox).not.toBeChecked()
      expect(raceCheckbox).toHaveAttribute('id', `race[0].${race}`)
      expect(raceCheckbox).toHaveAttribute('name', 'race[0]')
    })

    ethnicityOptions.forEach((ethnicity) => {
      const ethnicityRadio = getByLabelText(`ethnicity.options.${ethnicity}`)
      expect(ethnicityRadio).not.toBeChecked()
      expect(ethnicityRadio).toHaveAttribute('id', `ethnicity.${ethnicity}`)
      expect(ethnicityRadio).toHaveAttribute('name', 'ethnicity')
    })

    const educationLevelDropdown = screen.getByLabelText(
      `education_level.label`
    )
    expect(educationLevelDropdown).toBeInTheDocument()
    educationLevelOptions.forEach((educationLevel) => {
      within(educationLevelDropdown).getByText(
        `education_level.options.${educationLevel}`
      )
    })
  })

  describe('sex', () => {
    it('Can check one radio button at a time', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <Demographics />
        </Formik>
      )
      const radio1 = screen.getByLabelText('sex.options.female')
      const radio2 = screen.getByLabelText('sex.options.male')
      const radio3 = screen.getByLabelText('sex.options.x')
      expect(radio1).not.toBeChecked()

      await user.click(radio1)
      expect(radio1).toBeChecked()

      await user.click(radio2)
      expect(radio2).toBeChecked()
      expect(radio1).not.toBeChecked()
      expect(radio3).not.toBeChecked()

      await user.click(radio3)
      expect(radio3).toBeChecked()
      expect(radio1).not.toBeChecked()
      expect(radio2).not.toBeChecked()
    })
  })

  describe('race', () => {
    it('Allows selection of race', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <Demographics />
        </Formik>
      )
      const americanIndianAN = screen.getByLabelText(
        'race.options.american_indian_or_alaskan'
      )
      const asian = screen.getByLabelText('race.options.asian')
      const black = screen.getByLabelText('race.options.black')
      const hawaiianPI = screen.getByLabelText(
        'race.options.hawaiian_or_pacific_islander'
      )
      const white = screen.getByLabelText('race.options.white')
      const optOut = screen.getByLabelText('race.options.opt_out')

      // Nothing should start checked
      expect(americanIndianAN).not.toBeChecked()
      expect(asian).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User clicks American Indian or Alaskan Native
      await user.click(americanIndianAN)
      expect(americanIndianAN).toBeChecked()
      expect(asian).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User clicks Asian
      await user.click(asian)
      expect(asian).toBeChecked()
      expect(americanIndianAN).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User clicks Black or African American
      await user.click(black)
      expect(black).toBeChecked()
      expect(americanIndianAN).not.toBeChecked()
      expect(asian).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User clicks Native Hawaiian or Other Pacific Islander
      await user.click(hawaiianPI)
      expect(hawaiianPI).toBeChecked()
      expect(americanIndianAN).not.toBeChecked()
      expect(asian).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User clicks White
      await user.click(white)
      expect(white).toBeChecked()
      expect(americanIndianAN).not.toBeChecked()
      expect(asian).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User clicks Choose not to answer
      await user.click(optOut)
      expect(optOut).toBeChecked()
      expect(americanIndianAN).not.toBeChecked()
      expect(asian).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(white).not.toBeChecked()
    })
  })

  describe('ethnicity', () => {
    it('Allows selection of ethnicity', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <Demographics />
        </Formik>
      )

      const radio1 = screen.getByLabelText('ethnicity.options.opt_out')
      const radio3 = screen.getByLabelText('ethnicity.options.not_hispanic')
      expect(radio1).not.toBeChecked()

      await user.click(radio1)
      expect(radio1).toBeChecked()
      await user.click(radio3)
      expect(radio3).toBeChecked()
      expect(radio1).not.toBeChecked()
    })
  })

  describe('education level', () => {
    it('Allows selection of an education level', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={{}} onSubmit={noop}>
          <Demographics />
        </Formik>
      )

      const educationLevelDropdown = screen.getByLabelText(
        'education_level.label'
      )
      expect(educationLevelDropdown).toHaveValue('')

      await user.click(educationLevelDropdown)
      await user.selectOptions(educationLevelDropdown, 'none')
      expect(educationLevelDropdown).toHaveValue('none')

      await user.selectOptions(educationLevelDropdown, 'high_school_ged')
      expect(educationLevelDropdown).toHaveValue('high_school_ged')
      expect(educationLevelDropdown).not.toHaveValue('none')
    })
  })
  // TODO: enable these tests when validations are set up
  // describe("validations", () => {
  //   describe("valid answers", () => {
  //     it.concurrent.each(getValidClaimFormFixtures("demographic"))(
  //       "passes with valid values: %o",
  //       (formData) => {
  //         const { t } = useTranslation("claimForm");
  //         const schema = DemographicPage.pageSchema(t);
  //
  //         expect(schema.isValidSync(formData)).toBeTruthy();
  //       }
  //     );
  //   });
  //
  //   describe("invalid answers", () => {
  //     it.concurrent.each(getInvalidClaimFormFixtures("demographic"))(
  //       "fails with invalid values: %o",
  //       (formData) => {
  //         const { t } = useTranslation("claimForm");
  //         const schema = DemographicPage.pageSchema(t);
  //
  //         expect(schema.isValidSync(formData)).toBeFalsy();
  //       }
  //     );
  //   });
  // });
})
