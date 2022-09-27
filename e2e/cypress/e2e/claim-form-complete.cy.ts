import fillPersonalFields from './formPageFilling/personal'
import fillDemographicsFields from './formPageFilling/demographics'
import fillContactFields from './formPageFilling/contact'
import fillUnionFields from './formPageFilling/union'
import fillIdentityFields from './formPageFilling/identity'
import fillAbleAndAvailableFields from './formPageFilling/able_and_available'
import fillPaymentFields from './formPageFilling/payment'
import fillEducationAndTrainingFields from './formPageFilling/education_and_training'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    // Personal page
    cy.visit('/claim/personal')
    fillPersonalFields(
      {
        alternate_names: [{ first_name: 'Tasha', last_name: 'McGee' }],
      },
      {
        residence_address: {
          address: '1 Street',
          city: 'City',
          state: 'CA',
          zipcode: '00000',
        },
      }
    )
    cy.checkA11y()
    cy.clickNext()

    // Contact page
    fillContactFields()
    cy.checkA11y()
    cy.clickNext()

    // Demographics page
    fillDemographicsFields({
      sex: 'female',
      ethnicity: 'not_hispanic',
      races: ['asian'],
      education_level: 'bachelors',
    })
    cy.checkA11y()
    cy.clickNext()

    fillIdentityFields({
      drivers_license: 'D12345678912345',
      work_authorization: {
        authorized_to_work: true,
        authorization_type: 'US_citizen_or_national',
      },
    })
    cy.checkA11y()
    cy.clickNext()

    // Education and training page
    fillEducationAndTrainingFields({
      attending_college_or_job_training: 'yes',
      enrollment: 'self_enrolled',
    })
    cy.checkA11y()
    cy.clickNext()

    // Union page
    fillUnionFields({
      required_to_seek_work_through_hiring_hall: true,
      union_name: 'United ACME',
      union_local_number: '12345',
    })
    cy.checkA11y()
    cy.clickNext()

    // Able and available page
    fillAbleAndAvailableFields({
      can_begin_work_immediately: 'yes',
      has_collected_disability: 'yes',
      disabled_immediately_before: 'no',
      type_of_disability: 'state_plan',
      date_disability_began: { mo: '01', day: '05', yr: '2020' },
      recovery_date: { mo: '05', day: '02', yr: '2020' },
      contacted_last_employer_after_recovery: 'yes',
    })
    cy.checkA11y()
    cy.clickNext()

    // Payment page
    fillPaymentFields({
      federal_income_tax_withheld: 'no',
      payment_method: 'direct_deposit',
      account_type: 'checking',
      routing_number: '12345',
      account_number: 'abcdefg',
    })
  })
})
