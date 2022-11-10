const fillPrequalFields = () => {
  cy.get('input[id=filed_in_last_12mo\\.yes]').parent().click()
  cy.get('[name=state_province_territory_where_filed]').select('AL')
  cy.get('input[id=lived_outside_nj_when_working_nj\\.yes]').parent().click()
  cy.get('input[id=will_look_for_work_in_nj\\.yes]').parent().click()
  cy.get('input[id=can_begin_work_immediately\\.yes]').parent().click()
  cy.get('input[id=federal_work_in_last_18mo\\.no]').parent().click()
}

export default fillPrequalFields
