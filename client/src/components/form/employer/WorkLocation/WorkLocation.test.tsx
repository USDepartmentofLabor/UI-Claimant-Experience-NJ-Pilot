import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { WorkLocation } from 'components/form/employer/WorkLocation/WorkLocation'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

describe('WorkLocation component', () => {
  const { data } = useGetRecentEmployers()
  const renderWorkLocation = () => {
    render(
      <Formik initialValues={data[0]} onSubmit={noop}>
        <WorkLocation />
      </Formik>
    )

    const sectionTitle = screen.getByText('section_title')

    const workedAtEmployerAddressQuestion = screen.getByRole('group', {
      name: 'worked_at_employer_address.label',
    })
    const workedAtEmployerAddressYesAnswer = within(
      workedAtEmployerAddressQuestion
    ).getByRole('radio', { name: 'yes' })
    const workedAtEmployerAddressNoAnswer = within(
      workedAtEmployerAddressQuestion
    ).getByRole('radio', { name: 'no' })

    const employerPhoneAccurateQuestion = screen.getByRole('group', {
      name: 'is_employer_phone_accurate.label',
    })
    const employerPhoneAccurateYesAnswer = within(
      employerPhoneAccurateQuestion
    ).getByRole('radio', { name: 'yes' })
    const employerPhoneAccurateNoAnswer = within(
      employerPhoneAccurateQuestion
    ).getByRole('radio', { name: 'no' })

    return {
      sectionTitle,
      workedAtEmployerAddressQuestion,
      workedAtEmployerAddressYesAnswer,
      workedAtEmployerAddressNoAnswer,
      employerPhoneAccurateQuestion,
      employerPhoneAccurateYesAnswer,
      employerPhoneAccurateNoAnswer,
    }
  }

  it('renders without errors', () => {
    const {
      sectionTitle,
      workedAtEmployerAddressQuestion,
      workedAtEmployerAddressYesAnswer,
      workedAtEmployerAddressNoAnswer,
      employerPhoneAccurateQuestion,
      employerPhoneAccurateYesAnswer,
      employerPhoneAccurateNoAnswer,
    } = renderWorkLocation()

    expect(sectionTitle).toBeInTheDocument()

    expect(workedAtEmployerAddressQuestion).toBeInTheDocument()
    expect(workedAtEmployerAddressYesAnswer).toBeInTheDocument()
    expect(workedAtEmployerAddressYesAnswer).not.toBeChecked()
    expect(workedAtEmployerAddressNoAnswer).toBeInTheDocument()
    expect(workedAtEmployerAddressNoAnswer).not.toBeChecked()

    expect(employerPhoneAccurateQuestion).toBeInTheDocument()
    expect(employerPhoneAccurateYesAnswer).toBeInTheDocument()
    expect(employerPhoneAccurateYesAnswer).not.toBeChecked()
    expect(employerPhoneAccurateNoAnswer).toBeInTheDocument()
    expect(employerPhoneAccurateNoAnswer).not.toBeChecked()
  })

  it('clears alternate physical work address when hidden then shown', async () => {
    const {
      workedAtEmployerAddressYesAnswer,
      workedAtEmployerAddressNoAnswer,
    } = renderWorkLocation()

    // Toggle alternate physical work address 'No'
    await userEvent.click(workedAtEmployerAddressNoAnswer)

    // Show alternate physical work address and fill in some fields
    const workedAtEmployerAddressCity = screen.getByLabelText('city.label', {
      exact: false,
    })
    const workedAtEmployerAddressStateDropdown = screen.getByLabelText(
      'state.label',
      {
        exact: false,
      }
    )
    const workedAtEmployerAddressZipCode = screen.getByLabelText(
      'zipcode.label',
      {
        exact: false,
      }
    )

    expect(workedAtEmployerAddressCity).toBeInTheDocument()
    expect(workedAtEmployerAddressStateDropdown).toBeInTheDocument()
    expect(workedAtEmployerAddressZipCode).toBeInTheDocument()

    await userEvent.type(workedAtEmployerAddressCity, 'Some City')
    await userEvent.selectOptions(workedAtEmployerAddressStateDropdown, 'NJ')
    await userEvent.type(workedAtEmployerAddressZipCode, '01234')

    expect(workedAtEmployerAddressCity).toHaveValue('Some City')
    expect(workedAtEmployerAddressStateDropdown).toHaveValue('NJ')
    expect(workedAtEmployerAddressZipCode).toHaveValue('01234')

    // Toggle alternate physical work address 'Yes' and hide alternate physical work address text fields
    await userEvent.click(workedAtEmployerAddressYesAnswer)

    expect(workedAtEmployerAddressCity).not.toBeInTheDocument()
    expect(workedAtEmployerAddressStateDropdown).not.toBeInTheDocument()
    expect(workedAtEmployerAddressZipCode).not.toBeInTheDocument()

    // Toggle alternate physical work address 'No'
    await userEvent.click(workedAtEmployerAddressNoAnswer)

    // Show alternate physical work address and have empty value in fields
    const workedAtEmployerAddressCityReturned = screen.getByLabelText(
      'city.label',
      {
        exact: false,
      }
    )
    const workedAtEmployerAddressStateReturned = screen.getByLabelText(
      'state.label',
      {
        exact: false,
      }
    )
    const workedAtEmployerAddressZipCodeReturned = screen.getByLabelText(
      'zipcode.label',
      {
        exact: false,
      }
    )

    expect(workedAtEmployerAddressCityReturned).toBeInTheDocument()
    expect(workedAtEmployerAddressStateReturned).toBeInTheDocument()
    expect(workedAtEmployerAddressZipCodeReturned).toBeInTheDocument()

    expect(workedAtEmployerAddressCityReturned).toHaveValue('')
    expect(workedAtEmployerAddressStateReturned).toHaveValue('')
    expect(workedAtEmployerAddressZipCodeReturned).toHaveValue('')
  })

  it('clears employer phone number when hidden then shown', async () => {
    const { employerPhoneAccurateYesAnswer, employerPhoneAccurateNoAnswer } =
      renderWorkLocation()

    // Toggle employer phone accurate 'No'
    await userEvent.click(employerPhoneAccurateNoAnswer)

    // Show workLocationPhone and fill in some phone number
    const workLocationPhone = screen.getByLabelText(
      'work_location_phone.label',
      {
        exact: false,
      }
    )

    expect(workLocationPhone).toBeInTheDocument()

    await userEvent.type(workLocationPhone, '123-456-7890')
    expect(workLocationPhone).toHaveValue('123-456-7890')

    // Toggle employer phone accurate 'Yes' and hide employer phone accurate text field
    await userEvent.click(employerPhoneAccurateYesAnswer)

    expect(workLocationPhone).not.toBeInTheDocument()

    // Toggle employer phone accurate 'No'
    await userEvent.click(employerPhoneAccurateNoAnswer)

    // Show workLocationPhone and have empty value in field
    const workLocationPhoneReturned = screen.getByLabelText(
      'work_location_phone.label',
      {
        exact: false,
      }
    )

    expect(workLocationPhoneReturned).toBeInTheDocument()
    expect(workLocationPhoneReturned).toHaveValue('')
  })

  it('work location address text changes with imported employer', () => {
    const importedImployer = {
      imported_address: {
        employerAddressLine1: '1 John Fitch Plaza',
        employerAddressLine2: null,
        employerAddressLine3: null,
        employerAddressLine4: null,
        employerAddressLine5: ' Trenton NJ',
        employerAddressZip: '11111',
      },
      is_imported: true,
    }
    render(
      <Formik initialValues={importedImployer} onSubmit={noop}>
        <WorkLocation />
      </Formik>
    )

    expect(
      screen.getByRole('group', {
        name: 'worked_at_employer_address.label_imported',
      })
    ).toBeInTheDocument()
  })
})
