import { render, waitFor } from '@testing-library/react'
import { Formik } from 'formik'

import { ClaimantNames } from './ClaimantNames'
import userEvent from '@testing-library/user-event'
import { noop } from 'helpers/noop/noop'
import { PERSON_NAME_SKELETON } from 'constants/initialValues'
import { LiveAnnouncer } from 'react-aria-live'

describe('ClaimantNames component', () => {
  it('renders properly', () => {
    const claimantName = 'claimant_name'
    const alternateNames = 'alternate_names'
    const initialValues = {
      [claimantName]: {
        ...PERSON_NAME_SKELETON,
      },
      [alternateNames]: [],
    }

    const { getByLabelText } = render(
      <LiveAnnouncer>
        <Formik initialValues={initialValues} onSubmit={noop}>
          <ClaimantNames />
        </Formik>
      </LiveAnnouncer>
    )

    const claimantFirstNameField = getByLabelText('name.first_name.label')
    const claimantMiddleNameField = getByLabelText('name.middle_name.label')
    const claimantLastNameField = getByLabelText('name.last_name.label')

    expect(claimantFirstNameField).toHaveValue('')
    expect(claimantFirstNameField).toHaveAttribute(
      'id',
      `${claimantName}.first_name`
    )
    expect(claimantFirstNameField).toHaveAttribute(
      'name',
      `${claimantName}.first_name`
    )

    expect(claimantMiddleNameField).toHaveValue('')
    expect(claimantMiddleNameField).toHaveAttribute(
      'id',
      `${claimantName}.middle_name`
    )
    expect(claimantMiddleNameField).toHaveAttribute(
      'name',
      `${claimantName}.middle_name`
    )

    expect(claimantLastNameField).toHaveValue('')
    expect(claimantLastNameField).toHaveAttribute(
      'id',
      `${claimantName}.last_name`
    )
    expect(claimantLastNameField).toHaveAttribute(
      'name',
      `${claimantName}.last_name`
    )
  })

  describe('alternate names', () => {
    const user = userEvent.setup()
    it('fields are toggled via radio button control', async () => {
      const claimantName = 'claimant_name'
      const alternateNames = 'alternate_names'
      const initialValues = {
        [claimantName]: {
          ...PERSON_NAME_SKELETON,
        },
        [alternateNames]: [],
      }

      const { getByRole, getAllByLabelText } = render(
        <LiveAnnouncer>
          <Formik initialValues={initialValues} onSubmit={noop}>
            <ClaimantNames />
          </Formik>
        </LiveAnnouncer>
      )

      const yesAlternateNames = getByRole('radio', { name: 'yes' })
      const noAlternateNames = getByRole('radio', { name: 'no' })

      await user.click(yesAlternateNames)

      const [claimantFirstNameField, claimantAlternateFirstNameField] =
        getAllByLabelText('name.first_name.label')
      const [claimantMiddleNameField, claimantAlternateMiddleNameField] =
        getAllByLabelText('name.middle_name.label')
      const [claimantLastNameField, claimantAlternateLastNameField] =
        getAllByLabelText('name.last_name.label')

      await waitFor(() => {
        expect(claimantFirstNameField).toHaveValue('')
        expect(claimantFirstNameField).toHaveAttribute(
          'id',
          `${claimantName}.first_name`
        )
        expect(claimantFirstNameField).toHaveAttribute(
          'name',
          `${claimantName}.first_name`
        )

        expect(claimantMiddleNameField).toHaveValue('')
        expect(claimantMiddleNameField).toHaveAttribute(
          'id',
          `${claimantName}.middle_name`
        )
        expect(claimantMiddleNameField).toHaveAttribute(
          'name',
          `${claimantName}.middle_name`
        )

        expect(claimantLastNameField).toHaveValue('')
        expect(claimantLastNameField).toHaveAttribute(
          'id',
          `${claimantName}.last_name`
        )
        expect(claimantLastNameField).toHaveAttribute(
          'name',
          `${claimantName}.last_name`
        )

        expect(claimantAlternateFirstNameField).toHaveValue('')
        expect(claimantAlternateFirstNameField).toHaveAttribute(
          'id',
          `${alternateNames}.0.first_name`
        )
        expect(claimantAlternateFirstNameField).toHaveAttribute(
          'name',
          `${alternateNames}.0.first_name`
        )

        expect(claimantAlternateMiddleNameField).toHaveValue('')
        expect(claimantAlternateMiddleNameField).toHaveAttribute(
          'id',
          `${alternateNames}.0.middle_name`
        )
        expect(claimantAlternateMiddleNameField).toHaveAttribute(
          'name',
          `${alternateNames}.0.middle_name`
        )

        expect(claimantAlternateLastNameField).toHaveValue('')
        expect(claimantAlternateLastNameField).toHaveAttribute(
          'id',
          `${alternateNames}.0.last_name`
        )
        expect(claimantAlternateLastNameField).toHaveAttribute(
          'name',
          `${alternateNames}.0.last_name`
        )
      })

      await user.click(noAlternateNames)

      expect(claimantAlternateFirstNameField).not.toBeInTheDocument()
      expect(claimantAlternateMiddleNameField).not.toBeInTheDocument()
      expect(claimantAlternateLastNameField).not.toBeInTheDocument()
    })

    // TODO: fix useClearFields to allow alternate names to have [] instead of undefined
    it('fields are cleared when toggled', async () => {
      const user = userEvent.setup()
      const claimantName = 'claimant_name'
      const alternateNames = 'alternate_names'
      const initialValues = {
        [claimantName]: {
          ...PERSON_NAME_SKELETON,
        },
        [alternateNames]: [],
      }

      const { getByRole, queryAllByLabelText } = render(
        <LiveAnnouncer>
          <Formik initialValues={initialValues} onSubmit={noop}>
            <ClaimantNames />
          </Formik>
        </LiveAnnouncer>
      )

      const yesAlternateNames = getByRole('radio', { name: 'yes' })
      const noAlternateNames = getByRole('radio', { name: 'no' })

      // Toggle on
      await user.click(yesAlternateNames)

      const claimantsAlternateFirstNameField = queryAllByLabelText(
        'name.first_name.label'
      )[1]
      const claimantsAlternateMiddleNameField = queryAllByLabelText(
        'name.middle_name.label'
      )[1]
      const claimantsAlternateLastNameField = queryAllByLabelText(
        'name.last_name.label'
      )[1]

      expect(claimantsAlternateFirstNameField).toBeInTheDocument()
      expect(claimantsAlternateMiddleNameField).toBeInTheDocument()
      expect(claimantsAlternateLastNameField).toBeInTheDocument()

      await user.type(claimantsAlternateFirstNameField, 'This')
      await user.type(claimantsAlternateMiddleNameField, 'Should')
      await user.type(claimantsAlternateLastNameField, 'Clear')

      expect(claimantsAlternateFirstNameField).toHaveValue('This')
      expect(claimantsAlternateMiddleNameField).toHaveValue('Should')
      expect(claimantsAlternateLastNameField).toHaveValue('Clear')

      // Toggle off
      await user.click(noAlternateNames)

      expect(claimantsAlternateFirstNameField).not.toBeInTheDocument()
      expect(claimantsAlternateMiddleNameField).not.toBeInTheDocument()
      expect(claimantsAlternateLastNameField).not.toBeInTheDocument()

      // Toggle back on
      await user.click(yesAlternateNames)

      const claimantAlternateFirstNameField = queryAllByLabelText(
        'name.first_name.label'
      )[1]
      const claimantAlternateMiddleNameField = queryAllByLabelText(
        'name.middle_name.label'
      )[1]
      const claimantAlternateLastNameField = queryAllByLabelText(
        'name.last_name.label'
      )[1]

      expect(claimantAlternateFirstNameField).toBeInTheDocument()
      expect(claimantAlternateMiddleNameField).toBeInTheDocument()
      expect(claimantAlternateLastNameField).toBeInTheDocument()

      expect(claimantAlternateFirstNameField).toHaveValue('')
      expect(claimantAlternateMiddleNameField).toHaveValue('')
      expect(claimantAlternateLastNameField).toHaveValue('')
    })
  })
})
