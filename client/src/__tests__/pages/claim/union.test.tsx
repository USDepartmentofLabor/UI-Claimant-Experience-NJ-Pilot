import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { Union } from 'pages/claim/union'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

describe('Union page', () => {
  beforeEach(() => {
    render(
      <Formik initialValues={{}} onSubmit={noop}>
        <Union />
      </Formik>
    )
  })

  it('renders', async () => {
    expect(await screen.findByText('is_union_member.label')).toBeInTheDocument()
  })

  it('toggles fields conditionally', async () => {
    const user = userEvent.setup()

    const isUnionMember = screen.getByRole('group', {
      name: 'is_union_member.label',
    })
    const yesMemberOfUnion = within(isUnionMember).getByRole('radio', {
      name: 'yes',
    })
    const noMemberOfUnion = within(isUnionMember).getByRole('radio', {
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

    await user.click(yesMemberOfUnion)

    expect(queryForUnionName()).toBeInTheDocument()
    expect(queryForUnionLocalNumber()).toBeInTheDocument()

    await user.click(noMemberOfUnion)

    expect(queryForUnionName()).not.toBeInTheDocument()
    expect(queryForUnionLocalNumber()).not.toBeInTheDocument()
  })
})
