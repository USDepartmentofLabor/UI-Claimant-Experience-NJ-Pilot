import { render, screen, within } from '@testing-library/react'
import { Union } from 'pages/claim/union'
import userEvent from '@testing-library/user-event'
import { UnionPageDefinition } from 'constants/pages/definitions/unionPageDefinition'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Union page', () => {
  beforeEach(() => {
    render(<Union />)
  })

  it('renders', async () => {
    expect(
      screen.queryByText('required_to_seek_work_through_hiring_hall.label')
    ).toBeInTheDocument()
  })

  it('toggles fields conditionally', async () => {
    const user = userEvent.setup()

    const seekWorkThroughHiringHall = screen.getByRole('group', {
      name: 'required_to_seek_work_through_hiring_hall.label',
    })
    const yesSeekWork = within(seekWorkThroughHiringHall).getByRole('radio', {
      name: 'yes',
    })
    const noSeekWork = within(seekWorkThroughHiringHall).getByRole('radio', {
      name: 'no',
    })

    const queryForUnionName = () =>
      screen.queryByLabelText('union_name.label', {
        exact: false,
      })
    const queryForUnionLocalNumber = () =>
      screen.queryByLabelText('union_local_number.label', {
        exact: false,
      })

    expect(queryForUnionName()).not.toBeInTheDocument()
    expect(queryForUnionLocalNumber()).not.toBeInTheDocument()

    await user.click(yesSeekWork)

    const unionName = screen.getByLabelText('union_name.label', {
      exact: false,
    })
    const unionNumber = screen.getByLabelText('union_local_number.label', {
      exact: false,
    })

    await user.type(unionName, 'Union Name')
    await user.type(unionNumber, '123')

    await user.click(noSeekWork)

    expect(queryForUnionName()).not.toBeInTheDocument()
    expect(queryForUnionLocalNumber()).not.toBeInTheDocument()

    await user.click(yesSeekWork)

    expect(queryForUnionName()).toHaveTextContent('')
    expect(queryForUnionLocalNumber()).toHaveTextContent('')
  })

  describe('Validation Schema', () => {
    describe('union_name', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          required_to_seek_work_through_hiring_hall: true,
          union_name: 'union name',
        }

        await expect(
          UnionPageDefinition.validationSchema.validateAt(
            `union_name`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          required_to_seek_work_through_hiring_hall: true,
          union_name: undefined,
        }

        await expect(
          UnionPageDefinition.validationSchema.validateAt(
            `union_name`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('union_local_number', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          required_to_seek_work_through_hiring_hall: true,
          union_local_number: '123',
        }

        await expect(
          UnionPageDefinition.validationSchema.validateAt(
            `union_local_number`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          required_to_seek_work_through_hiring_hall: true,
          union_local_number: undefined,
        }

        await expect(
          UnionPageDefinition.validationSchema.validateAt(
            `union_local_number`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = Union
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
