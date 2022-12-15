const fillEducationAndTrainingFields = (educationInfo) => {
  cy.get(
    `input[id=attending_college_or_job_training\\.${educationInfo['attending_college_or_job_training']}]`
  )
    .parent()
    .click()
  cy.get(
    `input[id=training_through_hiring_hall_or_career_center\\.${educationInfo['training_through_hiring_hall_or_career_center']}]`
  )
    .parent()
    .click()
}
export default fillEducationAndTrainingFields
