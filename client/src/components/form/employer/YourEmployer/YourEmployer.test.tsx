import React from 'react'
import { Formik } from 'formik'
import { YourEmployer } from 'components/form/employer/YourEmployer/YourEmployer'
import { render, screen, within } from '@testing-library/react'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'
import { Employer } from 'types/claimantInput'

export const validImportedEditEmployer: Employer = {
  employer_name: 'Lyft Inc.',
  is_imported: true,
  is_full_time: true,
  worked_for_imported_employer_in_last_18mo: true,
  payments_received: [
    {
      pay_type: 'none',
    },
  ],
  LOCAL_pay_types: ['none'],
  employment_start_date: '2021-12-12',
  employer_address: {
    address: '1 John Fitch Plaza',
    address2: undefined,
    address3: undefined,
    city: 'Trenton',
    state: 'NJ',
    zipcode: '11111',
  },
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

const validManuallyAddedEmployer: Employer = {
  ...validImportedEditEmployer,
  employer_address: {
    address: '',
    address2: undefined,
    address3: undefined,
    city: '',
    state: '',
    zipcode: '',
  },
  employer_phone: { number: '', sms: undefined },
  employer_name: undefined,
  fein: undefined,
  is_imported: false,
}

describe('YourEmployer component for imported employer', () => {
  const renderYourEmployer = (initialValues: Employer) => {
    render(
      <Formik initialValues={initialValues} onSubmit={noop}>
        <YourEmployer />
      </Formik>
    )

    const sectionTitle = screen.getByText('your_employer.heading')

    const fullTimePartTimeQuestion = screen.getByRole('group', {
      name: 'your_employer.is_full_time.label',
    })
    const fullTimePartTimeQuestionYesAnswer = within(
      fullTimePartTimeQuestion
    ).getByRole('radio', {
      name: 'your_employer.is_full_time.options.full_time',
    })
    const fullTimePartTimeQuestionNoAnswer = within(
      fullTimePartTimeQuestion
    ).getByRole('radio', {
      name: 'your_employer.is_full_time.options.part_time',
    })

    return {
      sectionTitle,
      fullTimePartTimeQuestion,
      fullTimePartTimeQuestionYesAnswer,
      fullTimePartTimeQuestionNoAnswer,
    }
  }

  it('renders without errors', () => {
    const {
      sectionTitle,
      fullTimePartTimeQuestion,
      fullTimePartTimeQuestionYesAnswer,
      fullTimePartTimeQuestionNoAnswer,
    } = renderYourEmployer(validImportedEditEmployer)

    expect(sectionTitle).toBeInTheDocument()

    expect(fullTimePartTimeQuestion).toBeInTheDocument()
    expect(fullTimePartTimeQuestionYesAnswer).toBeInTheDocument()
    expect(fullTimePartTimeQuestionNoAnswer).toBeInTheDocument()
  })

  it('can switch between full-time and part-time', async () => {
    const {
      fullTimePartTimeQuestionYesAnswer,
      fullTimePartTimeQuestionNoAnswer,
    } = renderYourEmployer(validImportedEditEmployer)

    expect(fullTimePartTimeQuestionYesAnswer).toBeChecked()
    expect(fullTimePartTimeQuestionNoAnswer).not.toBeChecked()

    await userEvent.click(fullTimePartTimeQuestionNoAnswer)
    expect(fullTimePartTimeQuestionYesAnswer).not.toBeChecked()
    expect(fullTimePartTimeQuestionNoAnswer).toBeChecked()
  })
})

describe('YourEmployer component for non-imported employer', () => {
  const renderYourEmployer = (validManuallyAddedEmployer: Employer) => {
    render(
      <Formik initialValues={validManuallyAddedEmployer} onSubmit={noop}>
        <YourEmployer />
      </Formik>
    )

    const sectionTitle = screen.getByText('your_employer.heading')

    const employerNameQuestion = screen.getByLabelText('employer_name.label', {
      exact: false,
    })
    const FEINQuestion = screen.getByLabelText('fein.label', {
      exact: false,
    })
    const employerStreetAddress = screen.getByLabelText(
      'employer_address.address.label',
      { exact: false }
    )
    const employerStreetAddress2 = screen.getByLabelText(
      'employer_address.address2.label',
      { exact: false }
    )
    const employerStreetAddress3 = screen.getByLabelText(
      'employer_address.address3.label',
      { exact: false }
    )
    const employerCityAddress = screen.getByLabelText(
      'employer_address.city.label',
      { exact: false }
    )
    const employerStateAddress = screen.getByLabelText(
      'employer_address.state.label',
      { exact: false }
    )
    const employerZIPAddress = screen.getByLabelText(
      'employer_address.zipcode.label',
      { exact: false }
    )
    const employerPhone = screen.getByLabelText('employer_phone.label', {
      exact: false,
    })

    const fullTimePartTimeQuestion = screen.getByRole('group', {
      name: 'your_employer.is_full_time.label',
    })
    const fullTimePartTimeQuestionYesAnswer = within(
      fullTimePartTimeQuestion
    ).getByRole('radio', {
      name: 'your_employer.is_full_time.options.full_time',
    })
    const fullTimePartTimeQuestionNoAnswer = within(
      fullTimePartTimeQuestion
    ).getByRole('radio', {
      name: 'your_employer.is_full_time.options.part_time',
    })

    return {
      sectionTitle,
      employerNameQuestion,
      FEINQuestion,
      employerStreetAddress,
      employerStreetAddress2,
      employerStreetAddress3,
      employerCityAddress,
      employerStateAddress,
      employerZIPAddress,
      employerPhone,
      fullTimePartTimeQuestion,
      fullTimePartTimeQuestionYesAnswer,
      fullTimePartTimeQuestionNoAnswer,
    }
  }

  it('renders without errors', () => {
    const {
      sectionTitle,
      employerNameQuestion,
      FEINQuestion,
      employerStreetAddress,
      employerStreetAddress2,
      employerStreetAddress3,
      employerCityAddress,
      employerStateAddress,
      employerZIPAddress,
      employerPhone,
      fullTimePartTimeQuestion,
      fullTimePartTimeQuestionYesAnswer,
      fullTimePartTimeQuestionNoAnswer,
    } = renderYourEmployer(validManuallyAddedEmployer)

    expect(sectionTitle).toBeInTheDocument()

    expect(employerNameQuestion).toBeInTheDocument()
    expect(FEINQuestion).toBeInTheDocument()
    expect(employerStreetAddress).toBeInTheDocument()
    expect(employerStreetAddress2).toBeInTheDocument()
    expect(employerStreetAddress3).toBeInTheDocument()
    expect(employerCityAddress).toBeInTheDocument()
    expect(employerStateAddress).toBeInTheDocument()
    expect(employerZIPAddress).toBeInTheDocument()
    expect(employerPhone).toBeInTheDocument()

    expect(fullTimePartTimeQuestion).toBeInTheDocument()
    expect(fullTimePartTimeQuestionYesAnswer).toBeInTheDocument()
    expect(fullTimePartTimeQuestionNoAnswer).toBeInTheDocument()
  })

  it('fills out fields without errors', async () => {
    const {
      employerNameQuestion,
      FEINQuestion,
      employerStreetAddress,
      employerStreetAddress2,
      employerStreetAddress3,
      employerCityAddress,
      employerStateAddress,
      employerZIPAddress,
      employerPhone,
      fullTimePartTimeQuestionYesAnswer,
    } = renderYourEmployer(validManuallyAddedEmployer)

    await userEvent.type(employerNameQuestion, 'Microsoft')
    expect(employerNameQuestion).toHaveValue('Microsoft')

    await userEvent.type(FEINQuestion, '12345678901234')
    expect(FEINQuestion).toHaveValue('12345678901234')

    await userEvent.type(employerStreetAddress, '1 Main St')
    expect(employerStreetAddress).toHaveValue('1 Main St')

    await userEvent.type(employerStreetAddress2, '2nd Stop Ave')
    expect(employerStreetAddress2).toHaveValue('2nd Stop Ave')

    await userEvent.type(employerStreetAddress3, 'PO BOX 1234')
    expect(employerStreetAddress3).toHaveValue('PO BOX 1234')

    await userEvent.type(employerCityAddress, 'Townsville')
    expect(employerCityAddress).toHaveValue('Townsville')

    await userEvent.selectOptions(employerStateAddress, 'NY')
    expect(employerStateAddress).toHaveValue('NY')

    await userEvent.type(employerZIPAddress, '01234')
    expect(employerZIPAddress).toHaveValue('01234')

    await userEvent.type(employerPhone, '555-555-5555')
    expect(employerPhone).toHaveValue('555-555-5555')

    await userEvent.click(fullTimePartTimeQuestionYesAnswer)
    expect(fullTimePartTimeQuestionYesAnswer).toBeChecked()
  })
})
