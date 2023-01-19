import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditEmployers from 'pages/claim/edit-employer/[editEmployerIndex]'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { ClaimantInput } from 'types/claimantInput'
import { RecentEmployersPageDefinition } from 'constants/pages/definitions/recentEmployersPageDefinition'
import { Routes } from 'constants/routes'
import { validImportedEditEmployer } from 'components/form/EditEmployer/EditEmployer.test'
import { getNextPage } from 'constants/pages/pageDefinitions'
import { QueryClient, QueryClientProvider } from 'react-query'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('queries/useGetPartialClaim')

const mockModifyEmployerAndSaveClaimFormValues = jest.fn(async () =>
  Promise.resolve()
)
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    modifyEmployerAndSaveClaimFormValues:
      mockModifyEmployerAndSaveClaimFormValues,
  }),
}))

const mockUseRouter = jest.fn()
const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter: () => mockUseRouter(),
}))

describe('the Edit Employer page', () => {
  const fullTimeEmployer = {
    ...validImportedEditEmployer,
    ...{ worked_for_imported_employer_in_last_18mo: true, is_full_time: true },
  }
  const partTimeEmployer = {
    ...validImportedEditEmployer,
    ...{ worked_for_imported_employer_in_last_18mo: true, is_full_time: false },
  }
  const notAnEmployer = {
    ...validImportedEditEmployer,
    ...{
      worked_for_imported_employer_in_last_18mo: false,
      is_full_time: false,
    },
  }

  beforeEach(() => {
    mockPush.mockClear()
    mockModifyEmployerAndSaveClaimFormValues.mockClear()
  })

  const renderEditEmployerPage = async (
    index: string,
    claimFormValues: ClaimantInput
  ) => {
    mockUseRouter.mockImplementation(() => ({
      query: {
        editEmployerIndex: index,
      },
      push: async (str: string) => await mockPush(str),
    }))

    const setClaimFormValues = (formData: ClaimantInput) => {
      claimFormValues = formData
    }

    await act(() =>
      render(
        <ClaimFormContext.Provider
          value={{
            claimFormValues,
            setClaimFormValues,
          }}
        >
          <EditEmployers />
        </ClaimFormContext.Provider>
      )
    )

    const editEmployerComponent = screen.queryByTestId(
      'edit-employer-component'
    )
    const loadFailArray = screen.queryAllByText(/This page could not be found/)
    const loadFailComponent =
      loadFailArray.length === 0
        ? null
        : screen.queryAllByText(/This page could not be found/)[0]

    return { editEmployerComponent, loadFailComponent }
  }

  describe('404 page', () => {
    const defaultClaimFormValues = {
      employers: [fullTimeEmployer, partTimeEmployer, notAnEmployer],
    }

    it('Loads when there are no employers in the context', async () => {
      const claimFormValues = {}
      renderEditEmployerPage('0', claimFormValues)

      const { editEmployerComponent, loadFailComponent } =
        await renderEditEmployerPage('0', claimFormValues)
      expect(editEmployerComponent).not.toBeInTheDocument()
      expect(loadFailComponent).toBeInTheDocument()
    })

    it('Loads when the index received is larger than the number of employers in the context', async () => {
      const { editEmployerComponent, loadFailComponent } =
        await renderEditEmployerPage('3', defaultClaimFormValues)

      expect(editEmployerComponent).not.toBeInTheDocument()
      expect(loadFailComponent).toBeInTheDocument()
    })

    it('Loads when the index is less than zero', async () => {
      const { editEmployerComponent, loadFailComponent } =
        await renderEditEmployerPage('-1', defaultClaimFormValues)

      expect(editEmployerComponent).not.toBeInTheDocument()
      expect(loadFailComponent).toBeInTheDocument()
    })

    it('Loads when the indexed employer is not actually an employer', async () => {
      const { editEmployerComponent, loadFailComponent } =
        await renderEditEmployerPage('2', defaultClaimFormValues)

      expect(editEmployerComponent).not.toBeInTheDocument()
      expect(loadFailComponent).toBeInTheDocument()
    })
  })

  describe('the initial values of the form', () => {
    const defaultClaimFormValues = {
      employers: [fullTimeEmployer, partTimeEmployer, notAnEmployer],
    }

    const getFullTimePartTime = () => {
      const editEmployerComponent = screen.getByTestId(
        'edit-employer-component'
      )
      const fullTimeYesNoQuestion = within(editEmployerComponent).getByRole(
        'group',
        { name: 'your_employer.is_full_time.label' }
      )
      const fullTimeYes = within(fullTimeYesNoQuestion).getByRole('radio', {
        name: /full_time$/,
      })
      const fullTimeNo = within(fullTimeYesNoQuestion).getByRole('radio', {
        name: /part_time/,
      })

      return { fullTimeYes, fullTimeNo }
    }

    it('includes the values of the employer if it is already in the array at that index', async () => {
      const { loadFailComponent } = await renderEditEmployerPage(
        '0',
        defaultClaimFormValues
      )

      const { fullTimeYes, fullTimeNo } = getFullTimePartTime()

      expect(fullTimeYes).toBeChecked()
      expect(fullTimeNo).not.toBeChecked()

      expect(loadFailComponent).not.toBeInTheDocument()
    })
  })

  describe('The employer form buttons', () => {
    const defaultClaimFormValues = {
      employers: [
        fullTimeEmployer,
        fullTimeEmployer,
        notAnEmployer,
        notAnEmployer,
        partTimeEmployer,
      ],
    }

    const getButtons = () => {
      const backButton = screen.getByRole('button', {
        name: 'pagination.previous',
      })
      const nextButton = screen.getByRole('button', { name: 'pagination.next' })

      return { backButton, nextButton }
    }

    describe('The employer back button', () => {
      it('Navigates back to the recent employers page when on the first index', async () => {
        const user = userEvent.setup()

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('0', defaultClaimFormValues)
        const { backButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()

        await user.click(backButton)

        expect(mockPush).toHaveBeenCalledWith(
          RecentEmployersPageDefinition.path
        )
        expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          fullTimeEmployer,
          '0'
        )
      })

      it('Navigates to the previous indexes employer when that previous index is an employer', async () => {
        const user = userEvent.setup()

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('1', defaultClaimFormValues)
        const { backButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()

        await user.click(backButton)

        expect(mockPush).toHaveBeenCalledWith(`${Routes.CLAIM.EDIT_EMPLOYER}/0`)
        expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          fullTimeEmployer,
          '1'
        )
      })

      it('Navigates before a number of indexes if those index are not employers', async () => {
        const user = userEvent.setup()

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('4', defaultClaimFormValues)
        const { backButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()

        await user.click(backButton)

        expect(mockPush).toHaveBeenCalledWith(`${Routes.CLAIM.EDIT_EMPLOYER}/1`)
        expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          partTimeEmployer,
          '4'
        )
      })
    })

    describe('The employer next button', () => {
      //TODO: make this actually go to the review employers page...
      it('Navigates to the review employers page when the index is at the end of the employer array', async () => {
        const user = userEvent.setup()

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('4', defaultClaimFormValues)
        const { nextButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()
        await user.click(nextButton)

        expect(mockPush).toHaveBeenCalledWith(
          getNextPage(RecentEmployersPageDefinition).path
        )
        expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          partTimeEmployer,
          '4'
        )
      })

      it('Navigates to the next index if the next index is an employer', async () => {
        const user = userEvent.setup()

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('0', defaultClaimFormValues)
        const { nextButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()
        await user.click(nextButton)

        expect(mockPush).toHaveBeenCalledWith(`${Routes.CLAIM.EDIT_EMPLOYER}/1`)
        expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          fullTimeEmployer,
          '0'
        )
      })

      it('Navigates past a number of indexes if those indexes are not employers', async () => {
        const user = userEvent.setup()

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('1', defaultClaimFormValues)
        const { nextButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()
        await user.click(nextButton)

        expect(mockPush).toHaveBeenCalledWith(`${Routes.CLAIM.EDIT_EMPLOYER}/4`)
        expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          fullTimeEmployer,
          '1'
        )
      })

      it('Fails to Navigate forward if the data entered was invalid', async () => {
        const user = userEvent.setup()
        const invalidClaimFormValues = {
          employers: [
            {
              ...fullTimeEmployer,
              ...{ employer_name: undefined, is_imported: false },
            },
            fullTimeEmployer,
            notAnEmployer,
            notAnEmployer,
            partTimeEmployer,
          ],
        }

        const { editEmployerComponent, loadFailComponent } =
          await renderEditEmployerPage('0', invalidClaimFormValues)
        const { nextButton } = getButtons()

        expect(editEmployerComponent).toBeInTheDocument()
        expect(loadFailComponent).not.toBeInTheDocument()
        await user.click(nextButton)

        expect(mockPush).not.toHaveBeenCalled()
        expect(mockModifyEmployerAndSaveClaimFormValues).not.toHaveBeenCalled()
      })
    })
  })

  it('renders properly', async () => {
    const claimFormValues = {
      employers: [{ ...validImportedEditEmployer }],
    }

    const { editEmployerComponent, loadFailComponent } =
      await renderEditEmployerPage('0', claimFormValues)

    expect(editEmployerComponent).toBeInTheDocument()
    expect(loadFailComponent).not.toBeInTheDocument()
  })

  describe('page layout', () => {
    mockUseRouter.mockImplementation(() => ({
      query: {
        editEmployerIndex: 0,
      },
      push: async (str: string) => await mockPush(str),
    }))

    it('uses the ClaimFormLayout', () => {
      const Page = EditEmployers
      expect(Page).toHaveProperty('getLayout')

      render(
        <QueryClientProvider client={new QueryClient()}>
          {Page.getLayout?.(<Page />)}
        </QueryClientProvider>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
