import fillDemographicsFields from './formPageFilling/demographics'
import fillContactFields from './formPageFilling/contact'
import fillUnionFields from './formPageFilling/union'
import fillIdentityFields from './formPageFilling/identity'
import fillDisabilityStatusFields from './formPageFilling/disabilityStatus'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    cy.visit('/claim/demographics')
    fillDemographicsFields({
      sex: 'female',
      ethnicity: 'not_hispanic',
      races: ['asian', 'hawaiian_or_pacific_islander'],
    })
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading

    cy.visit('/claim/contact')
    fillContactFields()
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading

    cy.visit('/claim/union')

    fillUnionFields({
      is_union_member: true,
      required_to_seek_work_through_hiring_hall: true,
      union_name: 'United ACME',
      union_local_number: '12345',
    })

    cy.visit('/claim/identity')

    fillIdentityFields({
      ssn: '111111111',
      birthdate: {
        month: '11',
        day: '5',
        year: '1982',
      },
      drivers_license: 'D12345678912345',
      state_license_issuer: 'NJ',
      work_authorization: {
        authorized_to_work: true,
        authorization_type: 'US_citizen_or_national',
      },
    })
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading

    cy.visit('/claim/disability')

    fillDisabilityStatusFields({
      has_collected_disability: 'yes',
      disabled_immediately_before: 'no',
      type_of_disability: 'State Plan',
      date_disability_began: '01/01/2020',
      recovery_date: '05/02/2020',
      contacted_last_employer_after_recovery: 'yes',
    })
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading
  })
})
