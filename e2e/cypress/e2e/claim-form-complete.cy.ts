import fillScreenerFields from './formPageFilling/screener'
import homePage from './formPageFilling/home'
import fillPrequalFields from './formPageFilling/prequal'
import fillPersonalFields from './formPageFilling/personal'
import fillDemographicsFields from './formPageFilling/demographics'
import fillContactFields from './formPageFilling/contact'
import fillUnionFields from './formPageFilling/union'
import fillIdentityFields from './formPageFilling/identity'
import fillDisabilityFields from './formPageFilling/disability'
import fillPaymentFields from './formPageFilling/payment'
import fillEducationAndTrainingFields from './formPageFilling/education_and_training'
import fillReviewFields from './formPageFilling/review'
import fillRecentEmployersFields from './formPageFilling/recent-employers'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    // Screener page
    cy.visit('/screener')
    fillScreenerFields()
    cy.checkA11y()
    cy.clickNext()

    // Home page
    homePage()

    // Prequal page
    fillPrequalFields()
    cy.checkA11y()
    cy.clickNext()

    // Personal page
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
    cy.lighthouse({
      accessibility: 100,
      'best-practices': 90,
      seo: 90,
      pwa: 20,
      performance: 40,
    })
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

    //Recent Employers
    fillRecentEmployersFields()
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
      enrollment: 'yes',
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

    // Disability page
    fillDisabilityFields({
      disability_applied_to_or_received: 'disability',
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
      payment_method: 'direct_deposit',
      account_type: 'checking',
      routing_number: '012345678',
      account_number: '01234567890123',
      federal_income_tax_withheld: 'no',
      apply_for_increased_payment_for_dependents: 'yes',
    })
    cy.checkA11y()
    cy.clickNext()

    // Review page
    fillReviewFields()
    cy.clickSubmit()

    // User lands on home page on successful completion
    cy.url().should('eq', `${Cypress.config().baseUrl}/?completed=true`)
  })
})
