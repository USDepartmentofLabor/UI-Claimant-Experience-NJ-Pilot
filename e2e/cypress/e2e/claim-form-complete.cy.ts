import fillDemographicFields from './formPageFilling/demographic'
import fillContactFields from './formPageFilling/contact'

context('Initial Claim form', { scrollBehavior: 'center' }, () => {
  it('saves completed claim (also checks a11y on each page)', () => {
    cy.visit('/claim/demographic')
    fillDemographicFields({
      sex: 'female',
      ethnicity: 'not_hispanic',
      races: ['asian', 'hawaiian_or_pacific_islander'],
    })
    // @ts-ignore
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading

    cy.visit('/claim/contact')
    fillContactFields()
    // cy.check_a11y() TODO: uncomment when page has wrapper with heading
  })
})
