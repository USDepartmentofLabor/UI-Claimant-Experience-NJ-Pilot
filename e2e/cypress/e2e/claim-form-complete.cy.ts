import { faker } from '@faker-js/faker'

import fillScreenerFields from './formPageFilling/screener'
import fillPrequalFields from './formPageFilling/prequal'
import fillPersonalFields from './formPageFilling/personal'
import fillDemographicsFields from './formPageFilling/demographics'
import {
  fillContactFields,
  checkUpdatedContactFields,
} from './formPageFilling/contact'
import fillUnionFields from './formPageFilling/union'
import fillIdentityFields from './formPageFilling/identity'
import fillDisabilityFields from './formPageFilling/disability'
import fillPaymentFields from './formPageFilling/payment'
import fillSsnField from './formPageFilling/ssn'
import fillOccupationFields from './formPageFilling/occupation'
import fillEducationAndTrainingFields from './formPageFilling/education_and_training'
import fillReviewFields from './formPageFilling/review'
import fillRecentEmployersFields from './formPageFilling/recent-employers'
import { generateWhoAmI } from './utils/generateWhoAmI'
import { fillEditEmployerFields } from './formPageFilling/edit-employer'
import fillReviewEmployersFields from './formPageFilling/review-employers'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    //,{defaultCommandTimeout:6000}
    const whoAmI = generateWhoAmI()
    cy.login({
      sub: faker.datatype.uuid(),
      whoAmI,
    })

    // Verify that the user is "signed in"
    // This can be removed when the user flow is ironed out and we know:
    //  - Where a user lands in our app?
    //  - What will the app do if the user is not logged in already?
    //  - What will the app do if the user is logged in already?
    //  - How will the user know that they are logged in?

    // Home page
    cy.visit('/')
    cy.get("h1[data-testid='home-page-heading']").contains(
      'Apply for Unemployment Insurance'
    )
    cy.checkA11y()
    cy.checkLighthouse()
    cy.get('[data-testid=sign-out-button-cmp]').should('be.visible')
    cy.get("button[data-testid='go-to-claim-form']")
      .scrollIntoView()
      .should('be.visible')
      .click()

    // Ssn (Access your records) page
    const ssnUnformatted = '987654321'
    fillSsnField({ ssn: ssnUnformatted })
    cy.checkA11y()
    cy.checkLighthouse()
    cy.get('[data-testid=next-button]')
      .contains('Continue')
      .scrollIntoView()
      .should('be.visible')
      .click()

    // Screener page
    fillScreenerFields()
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    // Prequal page
    fillPrequalFields()
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    // Identity page
    fillIdentityFields({
      has_nj_issued_id: 'yes',
      drivers_license_or_state_id_number: 'D12345678912345',
      work_authorization: {
        authorization_type: 'employment_authorization_or_card_or_doc',
        employment_authorization_document_name: {
          first_name: 'Jane',
          middle_initial: 'D',
          last_name: 'Doe',
          suffix: 'I',
        },
        alien_registration_number: '123456789',
        re_enter_alien_registration_number: '123456789',
        country_of_origin: 'Anguilla',
        employment_authorization_start_date: {
          mo: '01',
          day: '05',
          yr: '2019',
        },
        employment_authorization_end_date: { mo: '01', day: '05', yr: '2020' },
      },
    })
    cy.checkA11y()
    cy.checkLighthouse()
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
    cy.checkLighthouse({
      accessibility: 100,
      'best-practices': 90,
      seo: 90,
      pwa: 20,
      performance: 0,
    })
    cy.clickNext()

    // Contact page
    fillContactFields()
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    // Demographics page
    fillDemographicsFields({
      sex: 'female',
      ethnicity: 'not_hispanic',
      races: ['asian'],
      education_level: 'bachelors',
    })
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    //Recent Employers
    fillRecentEmployersFields()
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    fillEditEmployerFields()
    //TODO: Reenable the a11y check when NJWDS changes link color
    //cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    //review employer page
    fillReviewEmployersFields('EPIC COFFEE, INC')
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    // Occupation page
    fillOccupationFields({
      job_title: 'Software Engineer',
      job_description: 'Good at Googling',
    })
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    // Education and training page
    fillEducationAndTrainingFields({
      attending_college_or_job_training: 'yes',
      training_through_hiring_hall_or_career_center: 'yes',
    })
    cy.checkA11y()
    cy.checkLighthouse()
    cy.clickNext()

    // Union page
    fillUnionFields({
      required_to_seek_work_through_hiring_hall: true,
      union_name: 'United ACME',
      union_local_number: '12345',
    })
    cy.checkA11y()
    cy.checkLighthouse()
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
    cy.checkLighthouse()
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
    cy.checkLighthouse()
    cy.clickNext()

    // Review page
    checkUpdatedContactFields()
    fillReviewFields()
    cy.clickSubmit()

    // User lands on home page on successful completion
    cy.url().should('eq', `${Cypress.config().baseUrl}/?completed=true`)
  })
})
