import { render, screen } from '@testing-library/react'
import {
  buildReviewAddress,
  PersonalReview,
} from 'components/review/sections/PersonalReview/PersonalReview'
import { ClaimantInput } from 'types/claimantInput'
import { ClaimFormContext } from 'contexts/ClaimFormContext'
import { EMPTY_DROPDOWN_OPTION, SuffixOption } from 'constants/formOptions'

describe('PersonalReview component', () => {
  const renderPersonalReview = (claimFormValues: ClaimantInput) => {
    render(
      <ClaimFormContext.Provider
        value={{ claimFormValues, setClaimFormValues: jest.fn }}
      >
        <PersonalReview />
      </ClaimFormContext.Provider>
    )

    const firstNames = screen.queryAllByRole('group', {
      name: 'name.first_name.label',
    })
    const middleInitials = screen.queryAllByRole('group', {
      name: 'name.middle_initial.label',
    })
    const lastNames = screen.queryAllByRole('group', {
      name: 'name.last_name.label',
    })
    const suffixes = screen.queryAllByRole('group', {
      name: 'name.suffix.label',
    })
    const claimantHasAlternateNames = screen.queryByRole('group', {
      name: 'name.claimant_has_alternate_names.label',
    })
    const residenceAddress = screen.queryByRole('group', {
      name: 'personal.residence_address.label',
    })
    const mailingAddressSame = screen.queryByRole('group', {
      name: 'label.mailing_address_same',
    })
    const mailingAddress = screen.queryByRole('group', {
      name: 'personal.mailing_address.label',
    })

    return {
      firstNames,
      middleInitials,
      lastNames,
      suffixes,
      claimantHasAlternateNames,
      residenceAddress,
      mailingAddressSame,
      mailingAddress,
    }
  }

  it('renders correctly', () => {
    const values = {
      claimant_name: {
        first_name: 'first0',
        middle_initial: 'm',
        last_name: 'last0',
        suffix: EMPTY_DROPDOWN_OPTION,
      },
      LOCAL_claimant_has_alternate_names: true,
      alternate_names: [
        {
          first_name: 'first1',
          middle_initial: 'm',
          last_name: 'last1',
          suffix: 'junior' as SuffixOption,
        },
      ],
      residence_address: {
        address: '123 somewhere',
        city: 'someplace',
        state: 'NJ',
        zipcode: '12345',
      },
      LOCAL_mailing_address_same: false,
      mailing_address: {
        address: '123 somewhere else',
        city: 'someplace else',
        state: 'NJ',
        zipcode: '12345',
      },
    }

    const {
      firstNames,
      middleInitials,
      lastNames,
      suffixes,
      claimantHasAlternateNames,
      residenceAddress,
      mailingAddressSame,
      mailingAddress,
    } = renderPersonalReview(values)

    expect(firstNames).toHaveLength(2)
    expect(firstNames[0]).toHaveTextContent(values.claimant_name.first_name)

    expect(middleInitials).toHaveLength(2)
    expect(middleInitials[0]).toHaveTextContent(
      values.claimant_name.middle_initial
    )

    expect(lastNames).toHaveLength(2)
    expect(lastNames[0]).toHaveTextContent(values.claimant_name.last_name)

    expect(suffixes).toHaveLength(1)

    expect(claimantHasAlternateNames).toBeInTheDocument()

    expect(firstNames[1]).toHaveTextContent(
      values.alternate_names[0].first_name
    )
    expect(middleInitials[1]).toHaveTextContent(
      values.alternate_names[0].middle_initial
    )
    expect(lastNames[1]).toHaveTextContent(values.alternate_names[0].last_name)
    expect(suffixes[0]).toHaveTextContent(values.alternate_names[0].suffix)

    expect(residenceAddress).toBeInTheDocument()
    expect(residenceAddress).toHaveTextContent(
      buildReviewAddress(values.residence_address) as string
    )

    expect(mailingAddressSame).toBeInTheDocument()
    expect(mailingAddressSame).toHaveTextContent('no')

    expect(mailingAddress).toBeInTheDocument()
    expect(mailingAddress).toHaveTextContent(
      buildReviewAddress(values.mailing_address) as string
    )
  })

  it('does not show mailing address when claimant indicated it is the same as residence address', () => {
    const values: ClaimantInput = {
      residence_address: {
        address: '123 somewhere',
        city: 'someplace',
        state: 'NJ',
        zipcode: '12345',
      },
      LOCAL_mailing_address_same: true,
      mailing_address: {
        address: '123 somewhere',
        city: 'someplace',
        state: 'NJ',
        zipcode: '12345',
      },
    }

    const { residenceAddress, mailingAddressSame, mailingAddress } =
      renderPersonalReview(values)

    expect(residenceAddress).toBeInTheDocument()
    expect(residenceAddress).toHaveTextContent(
      buildReviewAddress(values.residence_address) as string
    )

    expect(mailingAddressSame).toBeInTheDocument()
    expect(mailingAddressSame).toHaveTextContent('yes')

    expect(mailingAddress).not.toBeInTheDocument()
  })
})
