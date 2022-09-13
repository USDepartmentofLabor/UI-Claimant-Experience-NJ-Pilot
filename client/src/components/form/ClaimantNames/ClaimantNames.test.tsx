import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'

import { ClaimantNames } from './ClaimantNames'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'
import { LiveAnnouncer } from 'react-aria-live'
import { PersonalPageDefinition } from 'pages/claim/personal'

const ALTERNATE_NAMES = 'alternate_names'

describe('ClaimantNames component', () => {
  const initialValues = PersonalPageDefinition.initialValues

  // re-useable queries
  const queryForAlternateNameFieldset = () =>
    screen.queryByRole('group', {
      name: 'alternate_name',
    })

  const getAlternateNameFieldset = () =>
    screen.getByRole('group', {
      name: 'alternate_name',
    })
  const getFirstNameField = (fieldset: HTMLElement) =>
    within(fieldset).getByLabelText('name.first_name.label')
  const getMiddleNameField = (fieldset: HTMLElement) =>
    within(fieldset).getByLabelText('name.middle_initial.label')
  const getLastNameField = (fieldset: HTMLElement) =>
    within(fieldset).getByLabelText('name.last_name.label')
  const getAlternateNamesQuestion = () =>
    screen.getByRole('group', {
      name: 'claimant_has_alternate_names.label',
    })
  const getYesAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'yes' })
  const getNoAnswer = (radioGroup: HTMLElement) =>
    within(radioGroup).getByRole('radio', { name: 'no' })

  it('renders properly', () => {
    render(
      <LiveAnnouncer>
        <Formik initialValues={initialValues} onSubmit={noop}>
          <ClaimantNames />
        </Formik>
      </LiveAnnouncer>
    )
    const alternateName = queryForAlternateNameFieldset()

    expect(alternateName).not.toBeInTheDocument()
  })

  describe('alternate names', () => {
    it('fields are toggled via radio button control', async () => {
      const user = userEvent.setup()
      render(
        <LiveAnnouncer>
          <Formik initialValues={initialValues} onSubmit={noop}>
            <ClaimantNames />
          </Formik>
        </LiveAnnouncer>
      )
      const hasAlternateNamesQuestion = getAlternateNamesQuestion()
      const yesAlternateNames = getYesAnswer(hasAlternateNamesQuestion)
      const noAlternateNames = getNoAnswer(hasAlternateNamesQuestion)
      const alternateNameBeforeClick = queryForAlternateNameFieldset()

      expect(alternateNameBeforeClick).not.toBeInTheDocument()

      await user.click(yesAlternateNames)

      const alternateName = getAlternateNameFieldset()
      const alternateFirstNameField = getFirstNameField(alternateName)
      const alternateMiddleNameField = getMiddleNameField(alternateName)
      const alternateLastNameField = getLastNameField(alternateName)

      expect(alternateFirstNameField).toHaveValue('')
      expect(alternateFirstNameField).toHaveAttribute(
        'id',
        `${ALTERNATE_NAMES}.0.first_name`
      )
      expect(alternateFirstNameField).toHaveAttribute(
        'name',
        `${ALTERNATE_NAMES}.0.first_name`
      )

      expect(alternateMiddleNameField).toHaveValue('')
      expect(alternateMiddleNameField).toHaveAttribute(
        'id',
        `${ALTERNATE_NAMES}.0.middle_initial`
      )
      expect(alternateMiddleNameField).toHaveAttribute(
        'name',
        `${ALTERNATE_NAMES}.0.middle_initial`
      )

      expect(alternateLastNameField).toHaveValue('')
      expect(alternateLastNameField).toHaveAttribute(
        'id',
        `${ALTERNATE_NAMES}.0.last_name`
      )
      expect(alternateLastNameField).toHaveAttribute(
        'name',
        `${ALTERNATE_NAMES}.0.last_name`
      )

      await user.click(noAlternateNames)

      expect(alternateName).not.toBeInTheDocument()
      expect(alternateFirstNameField).not.toBeInTheDocument()
      expect(alternateMiddleNameField).not.toBeInTheDocument()
      expect(alternateLastNameField).not.toBeInTheDocument()
    })

    it('fields are cleared when toggled', async () => {
      const user = userEvent.setup()
      render(
        <LiveAnnouncer>
          <Formik initialValues={initialValues} onSubmit={noop}>
            <ClaimantNames />
          </Formik>
        </LiveAnnouncer>
      )

      const hasAlternateNamesQuestion = getAlternateNamesQuestion()
      const yesAlternateNames = getYesAnswer(hasAlternateNamesQuestion)
      const noAlternateNames = getNoAnswer(hasAlternateNamesQuestion)

      // Toggle on
      await user.click(yesAlternateNames)

      const alternateName = getAlternateNameFieldset()
      const alternateFirstNameField = getFirstNameField(alternateName)
      const alternateMiddleNameField = getMiddleNameField(alternateName)
      const alternateLastNameField = getLastNameField(alternateName)

      await user.type(alternateFirstNameField, 'This')
      await user.type(alternateMiddleNameField, 'Should')
      await user.type(alternateLastNameField, 'Clear')

      expect(alternateFirstNameField).toHaveValue('This')
      expect(alternateMiddleNameField).toHaveValue('Should')
      expect(alternateLastNameField).toHaveValue('Clear')

      // Toggle off
      await user.click(noAlternateNames)

      expect(alternateFirstNameField).not.toBeInTheDocument()
      expect(alternateMiddleNameField).not.toBeInTheDocument()
      expect(alternateLastNameField).not.toBeInTheDocument()

      // Toggle back on
      await user.click(yesAlternateNames)

      const alternateNameReappeared = getAlternateNameFieldset()
      const alternateFirstNameFieldReappeared = getFirstNameField(
        alternateNameReappeared
      )
      const alternateMiddleNameFieldReappeared = getMiddleNameField(
        alternateNameReappeared
      )
      const alternateLastNameFieldReappeared = getLastNameField(
        alternateNameReappeared
      )

      expect(alternateFirstNameFieldReappeared).toHaveValue('')
      expect(alternateMiddleNameFieldReappeared).toHaveValue('')
      expect(alternateLastNameFieldReappeared).toHaveValue('')
    })
  })
})
