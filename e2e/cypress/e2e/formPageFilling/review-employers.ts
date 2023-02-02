//TODO fill out adding and editing an employer
import fillChangeInEmployment from './employer/changeInEmployment'
import {
  fillValidAddEmployer1,
  fillValidAddEmployer2,
} from './employer/employerFilling'

//Intentionally added a second employer
const fillReviewEmployersFields = (employer_name: string) => {
  const separationMessage = 'Fed up with only getting paid 500k'

  //Make sure we are on main page and let's edit the first employer
  cy.clickEditEmployer(employer_name)
  //Just a small modification
  fillChangeInEmployment({
    separation_circumstance: 'quit_or_retired',
    separation_circumstance_details: separationMessage,
    employment_start_date: { mo: '01', day: '13', yr: '2012' },
    employment_last_date: { mo: '02', day: '21', yr: '2022' },
    expect_to_be_recalled: false,
  })

  cy.clickNext('Save')

  //Save Modifications and go back to review employer screen
  cy.clickEditEmployer(employer_name)
  //Go back in and make sure changes were saved

  cy.get(`input[id=expect_to_be_recalled\\.no]`).should('be.checked')
  cy.get(`textarea[name=separation_circumstance_details]`).contains(
    separationMessage
  )
  cy.get(`input[name=employment_last_date\\.month]`).should('have.value', '2')
  cy.get(`input[name=employment_last_date\\.day]`).should('have.value', '21')
  cy.get(`input[name=employment_last_date\\.year]`).should('have.value', '2022')
  cy.get(`input[name=employment_start_date\\.month]`).should('have.value', '1')
  cy.get(`input[name=employment_start_date\\.day]`).should('have.value', '13')
  cy.get(`input[name=employment_start_date\\.year]`).should(
    'have.value',
    '2012'
  )
  //Now make another change but hit back this time and make sure changes were not saved

  cy.get(`textarea[name=separation_circumstance_details]`)
    .clear()
    .type('Actually I think 500k was a reasonable amount')

  cy.clickBack()
  cy.clickEditEmployer(employer_name)

  cy.get(`textarea[name=separation_circumstance_details]`).contains(
    separationMessage
  )
  cy.clickBack()

  //Add an employer
  cy.clickAddEmployer()

  fillValidAddEmployer1()

  cy.clickNext('Add')

  //Check that you added the employer

  cy.contains('h2', 'Google').should('be.visible')

  // Add another employer and make sure they both show
  cy.clickAddEmployer()

  fillValidAddEmployer2()
  cy.clickNext('Add')

  cy.contains('h2', 'Google').should('be.visible')
  cy.contains('h2', 'Quiznos').should('be.visible')

  // Now delete Quiznos because it doesn't exist anymore!

  cy.clickDeleteEmployer('Quiznos')

  cy.contains('h2', 'Google').should('be.visible')
}

export default fillReviewEmployersFields
