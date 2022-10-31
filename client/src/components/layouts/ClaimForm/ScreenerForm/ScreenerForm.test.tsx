import { render, screen, within } from '@testing-library/react'
import { ScreenerForm } from 'components/layouts/ClaimForm/ScreenerForm/ScreenerForm'
import { makeClaimFormRoute, Routes } from 'constants/routes'
import userEvent from '@testing-library/user-event'
import Screener from 'pages/screener'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => mockRouter(),
}))
jest.mock('constants/pages/pageDefinitions')
// jest.mock('pages/screener', () => ({
//   ScreenerPageDefinition: {
//     initialValues: {},
//     validationSchema: undefined,
//     heading: 'Test heading',
//   },
// }))

describe('ScreenerForm Layout', () => {
  const SomePage = () => <div>Some Page!</div>

  it('render properly with previous and next page buttons', async () => {
    mockRouter.mockImplementation(() => ({
      pathname: makeClaimFormRoute('some'),
    }))
    render(
      <ScreenerForm>
        <SomePage />
      </ScreenerForm>
    )

    await screen.findByText('Some Page!')

    const previousButton = screen.queryByText('pagination.previous')
    const nextButton = screen.queryByText('pagination.next')

    expect(previousButton).toBeInTheDocument()
    expect(nextButton).toBeInTheDocument()
  })

  it('clicking previous navigates to the previous page', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn(async () => true)
    mockRouter.mockImplementation(() => ({
      push: mockPush,
    }))

    render(
      <ScreenerForm>
        <SomePage />
      </ScreenerForm>
    )

    await screen.findByText('Some Page!')
    const previousButton = screen.getByText('pagination.previous')

    expect(previousButton).toBeInTheDocument()

    await user.click(previousButton)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
  })

  it.skip('clicking next navigates to the next page', async () => {
    const user = userEvent.setup()
    const mockPush = jest.fn(async () => true)
    mockRouter.mockImplementation(() => ({
      push: mockPush,
    }))

    render(
      <ScreenerForm>
        <SomePage />
      </ScreenerForm>
    )

    await screen.findByText('Some Page!')

    const nextButton = screen.getByText('pagination.next')

    expect(nextButton).toBeInTheDocument()

    await user.click(nextButton)

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
  })
  describe('redirects to the screener-redirect page', () => {
    const canUseFormValues = {
      screener_current_country_us: true,
      screener_live_in_canada: undefined,
      screener_job_last_eighteen_months: true,
      screener_all_work_nj: true,
      screener_any_work_nj: undefined,
      screener_currently_disabled: false,
      screener_military_service_eighteen_months: false,
      screener_maritime_employer_eighteen_months: false,
    }

    const fillScreenerFields = async (
      user: { [p: string]: any },
      formValues: { [p: string]: boolean | undefined }
    ) => {
      for (const k of Object.keys(formValues)) {
        if (formValues[`${k}`] !== undefined) {
          await user.click(
            within(
              screen.getByRole('group', { name: `${k}.label` })
            ).getByLabelText(formValues[`${k}`] === true ? 'yes' : 'no')
          )
        }
      }
    }
    it('when they say they are not in the US', async () => {
      const mockPush = jest.fn(async () => true)
      mockRouter.mockImplementation(() => ({
        push: mockPush,
      }))
      jest.requireActual('constants/pages/pageDefinitions')
      jest.requireActual('pages/screener')
      const user = userEvent.setup()
      const disqualifyingValues = {
        screener_current_country_us: false,
        screener_live_in_canada: true,
      }

      render(
        <ScreenerForm>
          <Screener />
        </ScreenerForm>
      )

      const formValues: { [p: string]: boolean | undefined } = {
        ...canUseFormValues,
        ...disqualifyingValues,
      }
      await fillScreenerFields(user, formValues)

      await user.click(screen.getByRole('button', { name: /next/i }))
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/^\/screener-redirect/)
      )
    })

    // it.skip('when no work was done in NJ', () => {})
    // it.skip('when they mark yes to having a disability', () => {})
    // it.skip('when they mark yes to military service', () => {})
    // it.skip('when they mark yes to maritime work', () => {})
  })
})
