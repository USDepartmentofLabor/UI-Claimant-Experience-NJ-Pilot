const fillEducationAndTrainingFields = (educationInfo) => {
  // ;['attending_college_or_job_training', 'enrollment'].forEach((id) => {
  //   cy.get(`input[id=${id}\\.${educationInfo[id]}]`).parent().click()
  // })
  cy.get(
    `input[id=attending_college_or_job_training\\.${educationInfo['attending_college_or_job_training']}]`
  )
    .parent()
    .click()
  cy.get(`input[id=enrollment\\.${educationInfo['enrollment']}]`)
    .parent()
    .click()
}
export default fillEducationAndTrainingFields
