import { act, render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { EditEmployer } from './EditEmployer'
import { yupEditEmployers } from 'components/form/EditEmployer/EditEmployer'
import { Employer } from 'types/claimantInput'

export const validImportedEditEmployer: Employer = {
  name: 'Lyft Inc.',
  is_imported: true,
  is_full_time: true,
  is_employer: true,
  payments_received: [
    {
      pay_type: 'none',
    },
  ],
  LOCAL_pay_types: ['none'],
  employment_start_date: '2021-12-12',
  employer_address: {
    address: '1 John Fitch Plaza',
    city: 'Trenton',
    state: 'NJ',
    zipcode: '11111',
  },
  worked_at_employer_address: true,
  is_employer_phone_accurate: true,
  self_employed: false,
  is_owner: false,
  corporate_officer_or_stock_ownership: true,
  expect_to_be_recalled: false,
  separation_circumstance: 'laid_off',
  employment_last_date: '2022-12-03',
}

const validManuallyAddedEmployer: Employer = {
  ...validImportedEditEmployer,
  is_imported: false,
}

describe('Edit Employer Component', () => {
  const renderEditEmployer = async (initialValues: Employer) => {
    await act(() =>
      render(
        <Formik initialValues={initialValues} onSubmit={() => undefined}>
          <EditEmployer />
        </Formik>
      )
    )

    const heading = screen.getByText(/Lyft Inc./i)
    const fullTimeQuestion = screen.getByRole('radio', {
      name: 'your_employer.is_full_time.options.full_time',
    })
    const selfEmployedQuestion = screen.getByTestId('self_employed.yes')
    const paymentsReceivedQuestion = screen.getByRole('group', {
      name: 'payments_received.payments_received_detail.pay_type.label',
    })

    const queryForPreamble = () => screen.queryByText('preamble')

    return {
      heading,
      fullTimeQuestion,
      selfEmployedQuestion,
      paymentsReceivedQuestion,
      queryForPreamble,
    }
  }

  describe('Imported Employers', () => {
    it('renders correctly ', async () => {
      const {
        heading,
        fullTimeQuestion,
        selfEmployedQuestion,
        paymentsReceivedQuestion,
        queryForPreamble,
      } = await renderEditEmployer(validImportedEditEmployer)

      expect(heading).toBeInTheDocument()
      expect(queryForPreamble()).not.toBeInTheDocument()
      expect(fullTimeQuestion).toBeInTheDocument()
      expect(selfEmployedQuestion).toBeInTheDocument()
      expect(paymentsReceivedQuestion).toBeInTheDocument()
    })
  })

  describe('Manually added employers', () => {
    it('renders correctly ', async () => {
      const {
        heading,
        fullTimeQuestion,
        selfEmployedQuestion,
        paymentsReceivedQuestion,
        queryForPreamble,
      } = await renderEditEmployer(validManuallyAddedEmployer)

      expect(heading).toBeInTheDocument()
      expect(queryForPreamble()).toBeInTheDocument()
      expect(fullTimeQuestion).toBeInTheDocument()
      expect(selfEmployedQuestion).toBeInTheDocument()
      expect(paymentsReceivedQuestion).toBeInTheDocument()
    })
  })
})
describe('Validates the schema', () => {
  describe('Definite recall field', () => {
    it('validates with a valid value', async () => {
      const schemaSlice = {
        employers: [
          {
            is_full_time: true,
            definite_recall: true,
            expect_to_be_recalled: true,
          },
        ],
      }
      await expect(
        yupEditEmployers.validateAt(`employers[0].definite_recall`, schemaSlice)
      ).resolves.toBeTruthy()
    })
  })
})
