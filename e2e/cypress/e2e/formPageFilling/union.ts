const fillUnionFields = (union) => {
  cy.get(
    `input[id=union\\.required_to_seek_work_through_hiring_hall\\.${
      union.required_to_seek_work_through_hiring_hall ? 'yes' : 'no'
    }]`
  ).click({ force: true })
  if (union.required_to_seek_work_through_hiring_hall) {
    cy.get('[name=union\\.union_name]')
      .should('be.visible')
      .clear()
      .type(union.union_name)
    cy.get('[name=union\\.union_local_number]')
      .clear()
      .type(union.union_local_number)
  }
}

export default fillUnionFields
