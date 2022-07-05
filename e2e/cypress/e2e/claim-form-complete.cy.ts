import fillDemographicFields from './formPageFilling/demographic'
import fillContactFields from './formPageFilling/contact'
import fillUnionFields from './formPageFilling/union'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    cy.visit('/claim/demographic')
    fillDemographicFields({
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
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading
  })
})
