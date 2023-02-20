import { act, render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { EditEmployer, EMPLOYER_SKELETON } from './EditEmployer'
import { yupEditEmployers } from 'components/form/EditEmployer/EditEmployer'
import { Employer, ImportedEmployerFields } from 'types/claimantInput'

const validImportedEmployerFields: ImportedEmployerFields = {
  is_imported: true,
  imported_address: {
    employerAddressLine1: '1 John Fitch Plaza',
    employerAddressLine2: 'Trenton NJ',
    employerAddressLine3: null,
    employerAddressLine4: null,
    employerAddressLine5: null,
    employerAddressZip: '11111',
  },
  worked_for_imported_employer_in_last_18mo: true,
}

export const validBaseEmployerFields: Employer = {
  ...EMPLOYER_SKELETON,
  employer_name: 'Lyft Inc.',
  is_full_time: true,

  payments_received: [
    {
      pay_type: 'none',
      note: '',
      total: '',
      date_pay_began: '',
      date_pay_ended: '',
    },
  ],
  LOCAL_pay_types: ['none'],
  employment_start_date: '2021-12-12',
  employer_phone: { number: '555-555-5555', sms: false },
  worked_at_employer_address: true,
  is_employer_phone_accurate: true,
  self_employed: false,
  is_owner: false,
  corporate_officer_or_stock_ownership: true,
  expect_to_be_recalled: false,
  separation_circumstance: 'laid_off',
  employment_last_date: '2022-12-03',
}

export const validImportedEditEmployer: Employer = {
  ...validBaseEmployerFields,
  ...validImportedEmployerFields,
}

const validManuallyAddedEmployer: Employer = {
  ...validBaseEmployerFields,
  is_imported: false,
  employer_address: {
    address: '1 John Fitch Plaza',
    address2: '',
    address3: '',
    city: 'Trenton',
    state: 'NJ',
    zipcode: '11111',
  },
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

    const heading = screen.getByText('your_employer.heading')
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
