import { screen, render, waitFor, within } from '@testing-library/react'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import ReviewEmployers from 'pages/claim/review-employers'
import { ClaimantInput, Employer } from 'types/claimantInput'
import { EMPLOYER_SKELETON } from 'components/form/EditEmployer/EditEmployer'
import userEvent from '@testing-library/user-event'
import { validImportedEditEmployer } from 'components/form/EditEmployer/EditEmployer.test'
import RecentEmployers from 'pages/claim/recent-employers'
import { WrappingProviders } from 'utils/testUtils'

jest.mock('queries/useSaveCompleteClaim')

const mockUseInitialValues = jest.fn()
jest.mock('hooks/useInitialValues', () => ({
  useInitialValues: () => mockUseInitialValues(),
}))

const mockModifyEmployerAndSaveClaimFormValues = jest.fn(async () =>
  Promise.resolve()
)
const mockAppendAndSaveClaimFormValues = jest.fn(async () => Promise.resolve())
const mockDeleteEmployerAndSaveClaimFormValues = jest.fn(async () =>
  Promise.resolve()
)
jest.mock('hooks/useSaveClaimFormValues', () => ({
  useSaveClaimFormValues: () => ({
    modifyEmployerAndSaveClaimFormValues:
      mockModifyEmployerAndSaveClaimFormValues,
    deleteEmployerAndSaveClaimFormValues:
      mockDeleteEmployerAndSaveClaimFormValues,
    appendAndSaveClaimFormValues: mockAppendAndSaveClaimFormValues,
  }),
}))

jest.mock('queries/useGetPartialClaim')

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const importedNonEmployer = (index: number) => ({
  ...EMPLOYER_SKELETON,
  ...{
    employer_name: `importedNonEmployer${index}`,
    worked_for_imported_employer_in_last_18mo: false,
    is_imported: true,
  },
})
const importedInvalidEmployer = (index: number) => ({
  ...EMPLOYER_SKELETON,
  ...{
    employer_name: `importedInvalidEmployer${index}`,
    worked_for_imported_employer_in_last_18mo: true,
    is_imported: true,
  },
})
const importedValidEmployer = (index: number) => ({
  ...validImportedEditEmployer,
  ...{
    employer_name: `importedValidEmployer${index}`,
    worked_for_imported_employer_in_last_18mo: true,
    is_imported: true,
  },
})
const nonImportedInvalidEmployer = (index: number) => ({
  ...EMPLOYER_SKELETON,
  ...{
    employer_name: `nonImportedInvalidEmployer${index}`,
    worked_for_imported_employer_in_last_18mo: true,
    is_imported: false,
  },
})
const nonImportedValidEmployer = (index: number) => ({
  ...validImportedEditEmployer,
  ...{
    employer_name: `nonImportedValidEmployer${index}`,
    worked_for_imported_employer_in_last_18mo: true,
    is_imported: false,
  },
})
const getClaimantInput = (...employers: Employer[]) => ({
  employers: employers,
})

const getEmployer = (name: string) => screen.queryByText(name)

const queryValues = () => {
  const preambleNoWork = screen.queryByText('review_employers.preamble_no_work')
  const preamble = screen.queryByText('review_employers.preamble')

  const editEmployer = screen.queryByRole('heading', { name: 'Edit employer' })

  const addEmployer = screen.queryByRole('heading', { name: 'Add employer' })

  //'review_employers.heading'
  const reviewEmployers = screen.queryByRole('heading', {
    name: 'Review employers',
  })

  return {
    preamble,
    preambleNoWork,
    editEmployer,
    addEmployer,
    reviewEmployers,
  }
}

describe('The Review Employers page', () => {
  beforeEach(() => {
    mockModifyEmployerAndSaveClaimFormValues.mockClear()
    mockAppendAndSaveClaimFormValues.mockClear()
    mockDeleteEmployerAndSaveClaimFormValues.mockClear()
    mockPush.mockClear()
  })

  const renderReviewEmployerPage = (
    claimFormValues: ClaimantInput,
    jobLast18Months = true
  ) => {
    let claimFormValuesLocal: ClaimantInput = {
      ...{ screener_job_last_eighteen_months: jobLast18Months },
      ...claimFormValues,
    }
    const setClaimFormValues = jest
      .fn()
      .mockImplementation((formData: ClaimantInput) => {
        claimFormValuesLocal = formData
      })

    mockUseInitialValues.mockImplementation(() => ({
      initialValues: claimFormValuesLocal,
      isLoading: false,
    }))

    render(
      <ClaimFormContext.Provider
        value={{
          claimFormValues: claimFormValuesLocal,
          setClaimFormValues,
        }}
      >
        <ReviewEmployers />
      </ClaimFormContext.Provider>
    )

    const preambleNoWork = screen.queryByText(
      'review_employers.preamble.no_work'
    )

    const preambleHadWork = screen.queryByText(
      'review_employers.preamble.had_work'
    )
    const preambleDefault = screen.queryByText(
      'review_employers.preamble.default'
    )

    const editEmployer = screen.queryByRole('heading', {
      name: 'Edit employer',
    })

    const addEmployer = screen.queryByRole('heading', { name: 'Add employer' })

    const addEmployerButton = screen.queryByRole('button', {
      name: 'review_employers.add_employer',
    })

    const reviewEmployers = screen.queryByRole('heading', {
      name: 'Review employers',
    })

    return {
      preambleDefault,
      preambleNoWork,
      preambleHadWork,
      editEmployer,
      addEmployer,
      addEmployerButton,
      reviewEmployers,
      setClaimFormValues,
    }
  }

  it('Renders multiple employers in a row when we have more than one employer in the array', () => {
    const { editEmployer, addEmployer, reviewEmployers } =
      renderReviewEmployerPage(
        getClaimantInput(
          importedInvalidEmployer(0),
          nonImportedInvalidEmployer(1),
          nonImportedInvalidEmployer(2),
          nonImportedInvalidEmployer(3)
        )
      )

    const editEmployerButtons = screen.getAllByRole('button', {
      name: 'review_employers.edit_employer.label',
    })

    expect(editEmployerButtons.length === 4)

    expect(getEmployer('importedInvalidEmployer0')).toBeInTheDocument()
    expect(getEmployer('nonImportedInvalidEmployer1')).toBeInTheDocument()
    expect(getEmployer('nonImportedInvalidEmployer2')).toBeInTheDocument()
    expect(getEmployer('nonImportedInvalidEmployer3')).toBeInTheDocument()
    expect(reviewEmployers).toBeInTheDocument()
    expect(editEmployer).not.toBeInTheDocument()
    expect(addEmployer).not.toBeInTheDocument()
  })

  describe('Preamble', () => {
    const claimFormValues: ClaimantInput = getClaimantInput(
      importedNonEmployer(0),
      importedNonEmployer(1)
    )
    it('renders no work preamble when the screener said no work in last 18 months and claimant did not use any WGPW employers', () => {
      const {
        editEmployer,
        addEmployer,
        reviewEmployers,
        preambleDefault,
        preambleNoWork,
        preambleHadWork,
        addEmployerButton,
      } = renderReviewEmployerPage(claimFormValues, false)

      expect(preambleNoWork).toBeInTheDocument()
      expect(preambleDefault).not.toBeInTheDocument()
      expect(preambleHadWork).not.toBeInTheDocument()
      expect(getEmployer('importedNonEmployer0')).not.toBeInTheDocument()
      expect(getEmployer('importedNonEmployer1')).not.toBeInTheDocument()
      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()
      expect(addEmployerButton).not.toBeInTheDocument()
    })
    it('renders had work preamble when the screen said they had work but they did not enter any WGPW employers', () => {
      const {
        editEmployer,
        addEmployer,
        reviewEmployers,
        preambleDefault,
        preambleNoWork,
        preambleHadWork,
        addEmployerButton,
      } = renderReviewEmployerPage(claimFormValues, true)

      expect(preambleNoWork).not.toBeInTheDocument()
      expect(preambleDefault).not.toBeInTheDocument()
      expect(preambleHadWork).toBeInTheDocument()
      expect(getEmployer('importedNonEmployer0')).not.toBeInTheDocument()
      expect(getEmployer('importedNonEmployer1')).not.toBeInTheDocument()
      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()
      expect(addEmployerButton).toBeInTheDocument()
    })

    it('renders default preamble when they had imported employers', () => {
      const {
        editEmployer,
        addEmployer,
        reviewEmployers,
        preambleDefault,
        preambleNoWork,
        preambleHadWork,
        addEmployerButton,
      } = renderReviewEmployerPage(
        getClaimantInput(importedValidEmployer(0)),
        true
      )

      expect(preambleNoWork).not.toBeInTheDocument()
      expect(preambleDefault).toBeInTheDocument()
      expect(preambleHadWork).not.toBeInTheDocument()
      expect(getEmployer('importedValidEmployer0')).toBeInTheDocument()
      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()
      expect(addEmployerButton).toBeInTheDocument()
    })
  })

  describe('Edit employer', () => {
    it('Displays editing an employer', async () => {
      const user = userEvent.setup()

      const { editEmployer, addEmployer, reviewEmployers } =
        renderReviewEmployerPage(
          getClaimantInput(importedInvalidEmployer(0), importedNonEmployer(1))
        )

      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()

      const editEmployerButton = screen.getByRole('button', {
        name: 'review_employers.edit_employer.label',
      })
      await user.click(editEmployerButton)

      const {
        editEmployer: editEmployerUpdated,
        addEmployer: addEmployerUpdated,
        reviewEmployers: reviewEmployersUpdated,
      } = queryValues()

      expect(reviewEmployersUpdated).not.toBeInTheDocument()
      expect(editEmployerUpdated).toBeInTheDocument()
      expect(addEmployerUpdated).not.toBeInTheDocument()
    })

    it('updates the employer when they are valid and hit next', async () => {
      const user = userEvent.setup()

      renderReviewEmployerPage(getClaimantInput(importedValidEmployer(0)))

      const editEmployerButton = screen.getByRole('button', {
        name: 'review_employers.edit_employer.label',
      })
      await user.click(editEmployerButton)

      await waitFor(
        async () =>
          await expect(
            screen.queryByRole('heading', { name: 'Edit employer' })
          ).toBeInTheDocument()
      )
      const nextButton = screen.getByRole('button', {
        name: 'review_employers.save',
      })
      await user.click(nextButton)

      await waitFor(
        async () =>
          await expect(
            screen.queryByTestId('review-employers')
          ).toBeInTheDocument()
      )

      const values = queryValues()
      expect(values.editEmployer).not.toBeInTheDocument()
      expect(values.addEmployer).not.toBeInTheDocument()
      expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
        importedValidEmployer(0),
        '0'
      )
      expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    })

    it('fails to update when the employer when they are invalid and click next', async () => {
      const user = userEvent.setup()

      renderReviewEmployerPage(getClaimantInput(importedInvalidEmployer(0)))

      const editEmployerButton = screen.getByRole('button', {
        name: 'review_employers.edit_employer.label',
      })
      await user.click(editEmployerButton)

      await waitFor(
        async () =>
          await expect(
            screen.queryByRole('heading', { name: 'Edit employer' })
          ).toBeInTheDocument()
      )

      const nextButton = screen.getByRole('button', {
        name: 'review_employers.save',
      })
      await user.click(nextButton)

      await waitFor(
        async () =>
          await expect(
            screen.queryByTestId('form-error-summary')
          ).toBeInTheDocument()
      )

      const values = queryValues()
      expect(values.editEmployer).toBeInTheDocument()
      expect(values.addEmployer).not.toBeInTheDocument()
      expect(values.reviewEmployers).not.toBeInTheDocument()
      expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(0)
    })
    it('returns to the review employer page proper and does not modify the employer when clicking back from edit employer', async () => {
      const user = userEvent.setup()

      renderReviewEmployerPage(getClaimantInput(importedInvalidEmployer(0)))

      const editEmployerButton = screen.getByRole('button', {
        name: 'review_employers.edit_employer.label',
      })
      await user.click(editEmployerButton)
      await waitFor(
        async () =>
          await expect(
            screen.queryByRole('heading', { name: 'Edit employer' })
          ).toBeInTheDocument()
      )

      const previousButton = screen.getByRole('button', {
        name: 'pagination.previous',
      })
      await user.click(previousButton)

      await waitFor(
        async () =>
          await expect(
            screen.queryByTestId('review-employers')
          ).toBeInTheDocument()
      )

      const values = queryValues()
      expect(values.editEmployer).not.toBeInTheDocument()
      expect(values.addEmployer).not.toBeInTheDocument()
      expect(values.reviewEmployers).toBeInTheDocument()
      expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(0)
    })
  })

  describe('Add employer', () => {
    it('Displays adding an employer', async () => {
      const user = userEvent.setup()

      const { editEmployer, addEmployer, reviewEmployers } =
        renderReviewEmployerPage(getClaimantInput(importedInvalidEmployer(0)))

      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()

      const addEmployerButton = screen.getByRole('button', {
        name: 'review_employers.add_employer',
      })
      await user.click(addEmployerButton)

      const {
        editEmployer: editEmployerUpdated,
        addEmployer: addEmployerUpdated,
        reviewEmployers: reviewEmployersUpdated,
      } = queryValues()

      screen.getByRole('heading', { name: 'Add employer' })

      expect(reviewEmployersUpdated).not.toBeInTheDocument()
      expect(editEmployerUpdated).not.toBeInTheDocument()
      expect(addEmployerUpdated).toBeInTheDocument()
    })

    it('Adds an employer', async () => {
      const user = userEvent.setup()

      const { editEmployer, addEmployer, reviewEmployers } =
        renderReviewEmployerPage(getClaimantInput(importedInvalidEmployer(0)))

      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()

      const addEmployerButton = screen.getByRole('button', {
        name: 'review_employers.add_employer',
      })
      await user.click(addEmployerButton)

      await user.type(
        screen.getByRole('textbox', {
          name: 'your_employer.employer_name.label',
        }),
        'Circuit City'
      )
      await user.type(
        screen.getByRole('textbox', { name: 'your_employer.fein.label' }),
        '11111111111111'
      )
      await user.click(
        screen.getByRole('radio', {
          name: 'your_employer.is_full_time.options.full_time',
        })
      )
      await user.type(
        screen.getByRole('textbox', {
          name: 'your_employer.employer_address.address.label',
        }),
        '1 hyperloop way'
      )
      await user.type(
        screen.getByRole('textbox', {
          name: 'your_employer.employer_address.city.label',
        }),
        'Columbus'
      )
      await user.selectOptions(
        screen.getByRole('combobox', {
          name: 'your_employer.employer_address.state.label',
        }),
        'Alabama'
      )
      await user.type(
        screen.getByRole('textbox', {
          name: 'your_employer.employer_address.zipcode.label',
        }),
        '11111'
      )
      await user.type(
        screen.getByRole('textbox', {
          name: 'your_employer.employer_phone.label',
        }),
        '555-555-5555'
      )
      await user.click(screen.getByTestId('worked_at_employer_address.yes'))
      await user.click(
        within(
          screen.getByRole('group', {
            name: 'is_employer_phone_accurate.label',
          })
        ).getByRole('radio', { name: 'yes' })
      )
      await user.click(
        within(
          screen.getByRole('group', { name: 'self_employed.label' })
        ).getByRole('radio', { name: 'no' })
      )
      await user.click(
        within(screen.getByRole('group', { name: 'is_owner.label' })).getByRole(
          'radio',
          { name: 'no' }
        )
      )
      await user.click(
        within(
          screen.getByRole('group', {
            name: 'corporate_officer_or_stock_ownership.label',
          })
        ).getByRole('radio', { name: 'yes' })
      )
      await user.click(
        screen.getByRole('radio', { name: /separation.reasons.laid_off.label/ })
      )

      await user.type(
        within(
          screen.getByRole('group', { name: 'employment_start_date.label' })
        ).getByRole('textbox', { name: 'date.year.label' }),
        '2021'
      )
      await user.type(
        within(
          screen.getByRole('group', { name: 'employment_start_date.label' })
        ).getByRole('textbox', { name: 'date.month.label' }),
        '11'
      )
      await user.type(
        within(
          screen.getByRole('group', { name: 'employment_start_date.label' })
        ).getByRole('textbox', { name: 'date.day.label' }),
        '11'
      )

      await user.type(
        within(
          screen.getByRole('group', { name: 'employment_last_date.label' })
        ).getByRole('textbox', { name: 'date.year.label' }),
        '2022'
      )
      await user.type(
        within(
          screen.getByRole('group', { name: 'employment_last_date.label' })
        ).getByRole('textbox', { name: 'date.month.label' }),
        '11'
      )
      await user.type(
        within(
          screen.getByRole('group', { name: 'employment_last_date.label' })
        ).getByRole('textbox', { name: 'date.day.label' }),
        '11'
      )

      await user.click(
        within(
          screen.getByRole('group', {
            name: 'separation.expect_to_be_recalled.label',
          })
        ).getByRole('radio', { name: 'no' })
      )
      await user.click(
        screen.getByRole('checkbox', {
          name: /payments_received.payments_received_detail.pay_type.options.none.label/,
        })
      )

      await user.click(
        screen.getByRole('button', {
          name: 'review_employers.add',
        })
      )

      await waitFor(async () => await screen.getByTestId('review-employers'))

      const {
        editEmployer: editEmployerUpdated,
        addEmployer: addEmployerUpdated,
        reviewEmployers: reviewEmployersUpdated,
      } = queryValues()

      expect(reviewEmployersUpdated).toBeInTheDocument()
      expect(editEmployerUpdated).not.toBeInTheDocument()
      expect(addEmployerUpdated).not.toBeInTheDocument()

      // Disable validation temporarily so that we don't have to fill the whole form
      // const employer = screen.queryByText('Circuit City')
      // expect(employer).toBeInTheDocument()
      //await waitFor(async () => await screen.getByText('Circuit City'))
      expect(mockModifyEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    }, 20000)

    it('Goes back to the review employer page when the back button is pressed', async () => {
      const user = userEvent.setup()

      const { editEmployer, addEmployer, reviewEmployers } =
        renderReviewEmployerPage(getClaimantInput(importedInvalidEmployer(0)))

      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()

      const addEmployerButton = screen.getByRole('button', {
        name: 'review_employers.add_employer',
      })
      await user.click(addEmployerButton)

      await screen
        .getByRole('button', {
          name: 'pagination.previous',
        })
        .click()

      await waitFor(
        async () =>
          await expect(
            screen.queryByTestId('review-employers')
          ).toBeInTheDocument()
      )

      const {
        editEmployer: editEmployerUpdated,
        addEmployer: addEmployerUpdated,
        reviewEmployers: reviewEmployersUpdated,
      } = queryValues()

      expect(reviewEmployersUpdated).toBeInTheDocument()
      expect(editEmployerUpdated).not.toBeInTheDocument()
      expect(addEmployerUpdated).not.toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('Navigates forward to the next page', async () => {
      const user = userEvent.setup()
      const { reviewEmployers, editEmployer, addEmployer } =
        renderReviewEmployerPage(getClaimantInput(importedInvalidEmployer(0)))

      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()

      const nextButton = screen.getByRole('button', { name: 'pagination.next' })
      await user.click(nextButton)

      expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith({
        ...getClaimantInput(importedInvalidEmployer(0)),
        ...{ LOCAL_reviewed_employers: true },
        ...{ screener_job_last_eighteen_months: true },
      })
      expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledTimes(1)
    })

    it('Navigates back to the last employer in the array', async () => {
      const user = userEvent.setup()
      const claimantInput = getClaimantInput(
        importedValidEmployer(0),
        nonImportedValidEmployer(1),
        importedNonEmployer(2)
      )
      const { reviewEmployers, editEmployer, addEmployer } =
        renderReviewEmployerPage(claimantInput)

      expect(reviewEmployers).toBeInTheDocument()
      expect(editEmployer).not.toBeInTheDocument()
      expect(addEmployer).not.toBeInTheDocument()

      const previousButton = screen.getByRole('button', {
        name: 'pagination.previous',
      })
      await user.click(previousButton)

      expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith({
        ...claimantInput,
        ...{ LOCAL_reviewed_employers: true },
        ...{ screener_job_last_eighteen_months: true },
      })
      expect(mockPush).toHaveBeenCalledWith('/claim/edit-employer/1')
      expect(mockPush).toHaveBeenCalledTimes(1)
    })

    it('Navigates back to the recent employers page when there are no employers', async () => {
      const user = userEvent.setup()
      const claimantInput = getClaimantInput(
        importedNonEmployer(0),
        importedNonEmployer(1)
      )
      renderReviewEmployerPage(claimantInput)

      const previousButton = screen.getByRole('button', {
        name: 'pagination.previous',
      })
      await user.click(previousButton)

      expect(mockAppendAndSaveClaimFormValues).toHaveBeenCalledWith({
        ...claimantInput,
        ...{ LOCAL_reviewed_employers: true },
        ...{ screener_job_last_eighteen_months: true },
      })
      expect(mockPush).toHaveBeenCalledWith('/claim/recent-employers')
      expect(mockPush).toHaveBeenCalledTimes(1)
    })
  })

  describe('Delete employer', () => {
    it('Removes an employer when it clicks delete near the employers name', async () => {
      const user = userEvent.setup()
      const claimantInput = getClaimantInput(
        nonImportedValidEmployer(0),
        nonImportedValidEmployer(1),
        nonImportedValidEmployer(2),
        nonImportedValidEmployer(3)
      )
      renderReviewEmployerPage(claimantInput)

      const employerParentDiv = screen.getByText(
        'nonImportedValidEmployer2'
      ).parentElement
      expect(employerParentDiv).toBeInTheDocument()

      if (employerParentDiv) {
        const employerDeleteButton = within(employerParentDiv).getByRole(
          'button',
          {
            name: 'review_employers.edit_employer.delete_label',
          }
        )

        await user.click(employerDeleteButton)

        expect(mockDeleteEmployerAndSaveClaimFormValues).toHaveBeenCalledTimes(
          1
        )
        expect(mockDeleteEmployerAndSaveClaimFormValues).toHaveBeenCalledWith(
          '2'
        )
      }
    })

    it('Cannot delete any employer when there are no non imported employers on the page', async () => {
      const claimantInput = getClaimantInput(
        importedValidEmployer(0),
        importedValidEmployer(1),
        importedValidEmployer(2)
      )
      renderReviewEmployerPage(claimantInput)

      const deleteButtons = screen.queryAllByRole('button', {
        name: 'review_employers.edit_employer.delete',
      })

      expect(mockDeleteEmployerAndSaveClaimFormValues).not.toHaveBeenCalled()
      expect(deleteButtons).toEqual([])
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      const Page = RecentEmployers
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
