import { render } from '@testing-library/react'
import { Formik } from 'formik'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'

import Demographic from 'pages/claim/demographic'
import { noop } from 'helpers/noop/noop'
import { useTranslation } from 'react-i18next'
// import {
//   getInvalidClaimFormFixtures,
//   getValidClaimFormFixtures,
// } from "../../../testUtils/fixtures";
import {
  ethnicityOptions,
  raceOptions,
  sexOptions,
} from 'constants/formOptions'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
}))

describe('Demographic component', () => {
  const initialValues = {
    sex: undefined,
    race: [],
    ethnicity: undefined,
    education_level: undefined,
  }

  it('renders properly', () => {
    const { getByLabelText } = render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <Demographic />
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
      expect(raceCheckbox).toHaveAttribute('id', `race.${race}`)
      expect(raceCheckbox).toHaveAttribute('name', 'race')
    })

    ethnicityOptions.forEach((ethnicity) => {
      const ethnicityRadio = getByLabelText(`ethnicity.options.${ethnicity}`)
      expect(ethnicityRadio).not.toBeChecked()
      expect(ethnicityRadio).toHaveAttribute('id', `ethnicity.${ethnicity}`)
      expect(ethnicityRadio).toHaveAttribute('name', 'ethnicity')
    })
  })

  describe('sex', () => {
    it('Can check one radio button at a time', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <Demographic />
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
    it('Allows selection of multiple races', async () => {
      const user = userEvent.setup()
      const { getByLabelText } = render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <Demographic />
        </Formik>
      )

      const asian = getByLabelText('race.options.asian')
      const hawaiianPI = getByLabelText(
        'race.options.hawaiian_or_pacific_islander'
      )
      const black = getByLabelText('race.options.black')
      const white = getByLabelText('race.options.white')
      const optOut = getByLabelText('race.options.opt_out')

      // Checkboxes start unchecked
      expect(asian).not.toBeChecked()
      expect(hawaiianPI).not.toBeChecked()
      expect(black).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      // User checks a subset
      await user.click(asian)
      await user.click(hawaiianPI)

      // The checkboxes that the user clicked on are checked
      expect(asian).toBeChecked()
      expect(hawaiianPI).toBeChecked()

      // The checkboxes *not* clicked on remain unchecked
      expect(black).not.toBeChecked()
      expect(white).not.toBeChecked()
      expect(optOut).not.toBeChecked()

      await user.click(optOut)
      expect(optOut).toBeChecked()

      // TODO: uncomment these asserts when formik is hooked up
      // expect(asian).not.toBeChecked()
      // expect(asian).toBeDisabled()
      // expect(hawaiianPI).not.toBeChecked()
      // expect(hawaiianPI).toBeDisabled()
      // expect(black).not.toBeChecked()
      // expect(black).toBeDisabled()
      // expect(white).not.toBeChecked()
      // expect(white).toBeDisabled()
    })
  })

  describe('ethnicity', () => {
    it('Allows selection of ethnicity', async () => {
      const user = userEvent.setup()
      render(
        <Formik initialValues={initialValues} onSubmit={noop}>
          <Demographic />
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
