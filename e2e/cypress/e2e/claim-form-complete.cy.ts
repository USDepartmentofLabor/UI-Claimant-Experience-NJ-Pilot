import fillPersonalFields from './formPageFilling/personal'
import fillDemographicsFields from './formPageFilling/demographics'
import fillContactFields from './formPageFilling/contact'
import fillUnionFields from './formPageFilling/union'
import fillIdentityFields from './formPageFilling/identity'
import fillDisabilityStatusFields from './formPageFilling/disabilityStatus'
import fillPaymentFields from './formPageFilling/payment'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    // PersonalPage
    cy.visit('/claim/personal')
    fillPersonalFields(
      {
        first_name: 'Dave',
        middle_name: 'Rupert',
        last_name: 'Smith',
        alternate_names: [{ first_name: 'Tasha', last_name: 'McGee' }],
      },
      {
        residence_address: {
          address1: '1 Street',
          address2: 'Apartment 12345',
          city: 'City',
          state: 'CA',
          zipcode: '00000',
        },
      }
    )
    cy.checkA11y()
    cy.clickNext()

    fillContactFields()
    cy.checkA11y()
    cy.clickNext()

    fillDemographicsFields({
      sex: 'female',
      ethnicity: 'not_hispanic',
      races: ['asian', 'hawaiian_or_pacific_islander'],
    })
    cy.checkA11y()
    cy.clickNext()

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
    cy.checkA11y()
    cy.clickNext()

    fillUnionFields({
      is_union_member: true,
      required_to_seek_work_through_hiring_hall: true,
      union_name: 'United ACME',
      union_local_number: '12345',
    })
    cy.checkA11y()
    cy.clickNext()

    fillDisabilityStatusFields({
      has_collected_disability: 'yes',
      disabled_immediately_before: 'no',
      type_of_disability: 'State Plan',
      date_disability_began: '01/01/2020',
      recovery_date: '05/02/2020',
      contacted_last_employer_after_recovery: 'yes',
    })
    cy.checkA11y()
    cy.clickNext()

    // PaymentPage
    fillPaymentFields({
      federal_income_tax_withheld: 'no',
      payment_method: 'direct_deposit',
      account_type: 'checking',
      routing_number: '12345',
      account_number: 'abcdefg',
    })
  })
})
