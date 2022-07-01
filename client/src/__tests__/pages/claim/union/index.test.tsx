import { render, screen, waitFor } from '@testing-library/react'
import { Formik } from 'formik'
import { Union } from 'pages/claim/union'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
}))

describe('UnionProfile', () => {
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
  it('shows fields conditionally', async () => {
    const user = userEvent.setup()
    const yesButtons = screen.getAllByLabelText('yes')
    const getUnionName = () =>
      screen.queryByLabelText('union_name.label', {
        exact: false,
      })
    const getUnionLocalNumber = () =>
      screen.queryByLabelText('union_local_number.label', {
        exact: false,
      })
    // expect(getUnionName()).not.toBeInTheDocument()
    // expect(getUnionLocalNumber()).not.toBeInTheDocument() TODO: uncomment when claim wrapper done
    await user.click(yesButtons[0])
    expect(getUnionName()).toBeInTheDocument()
    expect(getUnionLocalNumber()).toBeInTheDocument()
  })
})
