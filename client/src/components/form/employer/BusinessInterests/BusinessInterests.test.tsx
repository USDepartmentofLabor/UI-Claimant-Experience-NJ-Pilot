import { render, screen, within } from '@testing-library/react'
import { Formik } from 'formik'
import { BusinessInterests } from 'components/form/employer/BusinessInterests/BusinessInterests'
import { noop } from 'helpers/noop/noop'
import userEvent from '@testing-library/user-event'
import { useGetRecentEmployers } from 'queries/__mocks__/useGetRecentEmployers'

describe('BusinessInterests component', () => {
  const { data } = useGetRecentEmployers()
  const renderBusinessInterests = () => {
    render(
      <Formik initialValues={data[0]} onSubmit={noop}>
        <BusinessInterests />
      </Formik>
    )

    const sectionTitle = screen.getByText('section_title')

    const selfEmployedQuestion = screen.getByRole('group', {
      name: 'self_employed.label',
    })
    const selfEmployedYesAnswer = within(selfEmployedQuestion).getByRole(
      'radio',
      { name: 'yes' }
    )
    const selfEmployedNoAnswer = within(selfEmployedQuestion).getByRole(
      'radio',
      { name: 'no' }
    )

    const isOwnerQuestion = screen.getByRole('group', {
      name: 'is_owner.label',
    })
    const isOwnerYesAnswer = within(isOwnerQuestion).getByRole('radio', {
      name: 'yes',
    })
    const isOwnerNoAnswer = within(isOwnerQuestion).getByRole('radio', {
      name: 'no',
    })

    const corporateOfficerOrStockOwnershipQuestion = screen.getByRole('group', {
      name: 'corporate_officer_or_stock_ownership.label',
    })
    const corporateOfficerOrStockOwnershipYesAnswer = within(
      corporateOfficerOrStockOwnershipQuestion
    ).getByRole('radio', { name: 'yes' })
    const corporateOfficerOrStockOwnershipNoAnswer = within(
      corporateOfficerOrStockOwnershipQuestion
    ).getByRole('radio', {
      name: 'no',
    })

    const queryForSoleProprietorshipQuestion = () =>
      screen.queryByRole('group', {
        name: 'employer_is_sole_proprietorship.label',
      })
    const queryForSoleProprietorshipYesAnswer = () => {
      const question = queryForSoleProprietorshipQuestion()
      return question !== null
        ? within(question).queryByRole('radio', { name: 'yes' })
        : null
    }
    const queryForSoleProprietorshipNoAnswer = () => {
      const question = queryForSoleProprietorshipQuestion()
      return question !== null
        ? within(question).queryByRole('radio', { name: 'no' })
        : null
    }

    const queryForRelatedToOwnerQuestion = () =>
      screen.queryByRole('group', {
        name: 'related_to_owner_or_child_of_owner_under_18.label',
      })
    const queryForRelatedToOwnerNoAnswer = () => {
      const question = queryForRelatedToOwnerQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'related_to_owner_or_child_of_owner_under_18.options.no.label',
          })
        : null
    }
    const queryForRelatedToOwnerSpouseAnswer = () => {
      const question = queryForRelatedToOwnerQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'related_to_owner_or_child_of_owner_under_18.options.spouse.label',
          })
        : null
    }
    const queryForRelatedToOwnerParentAnswer = () => {
      const question = queryForRelatedToOwnerQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'related_to_owner_or_child_of_owner_under_18.options.parent.label',
          })
        : null
    }
    const queryForRelatedToOwnerChildAnswer = () => {
      const question = queryForRelatedToOwnerQuestion()
      return question !== null
        ? within(question).queryByRole('radio', {
            name: 'related_to_owner_or_child_of_owner_under_18.options.child.label',
          })
        : null
    }

    return {
      sectionTitle,
      selfEmployedQuestion,
      selfEmployedYesAnswer,
      selfEmployedNoAnswer,
      isOwnerQuestion,
      isOwnerYesAnswer,
      isOwnerNoAnswer,
      corporateOfficerOrStockOwnershipQuestion,
      corporateOfficerOrStockOwnershipYesAnswer,
      corporateOfficerOrStockOwnershipNoAnswer,
      queryForSoleProprietorshipQuestion,
      queryForSoleProprietorshipYesAnswer,
      queryForSoleProprietorshipNoAnswer,
      queryForRelatedToOwnerQuestion,
      queryForRelatedToOwnerNoAnswer,
      queryForRelatedToOwnerSpouseAnswer,
      queryForRelatedToOwnerParentAnswer,
      queryForRelatedToOwnerChildAnswer,
    }
  }

  it('renders without errors', () => {
    const {
      sectionTitle,
      selfEmployedQuestion,
      selfEmployedYesAnswer,
      selfEmployedNoAnswer,
      isOwnerQuestion,
      isOwnerYesAnswer,
      isOwnerNoAnswer,
      corporateOfficerOrStockOwnershipQuestion,
      corporateOfficerOrStockOwnershipYesAnswer,
      corporateOfficerOrStockOwnershipNoAnswer,
      queryForSoleProprietorshipQuestion,
      queryForRelatedToOwnerQuestion,
    } = renderBusinessInterests()

    expect(sectionTitle).toBeInTheDocument()

    expect(selfEmployedQuestion).toBeInTheDocument()
    expect(selfEmployedYesAnswer).toBeInTheDocument()
    expect(selfEmployedYesAnswer).not.toBeChecked()
    expect(selfEmployedNoAnswer).toBeInTheDocument()
    expect(selfEmployedNoAnswer).not.toBeChecked()

    expect(isOwnerQuestion).toBeInTheDocument()
    expect(isOwnerYesAnswer).toBeInTheDocument()
    expect(isOwnerYesAnswer).not.toBeChecked()
    expect(isOwnerNoAnswer).toBeInTheDocument()
    expect(isOwnerNoAnswer).not.toBeChecked()

    expect(corporateOfficerOrStockOwnershipQuestion).toBeInTheDocument()
    expect(corporateOfficerOrStockOwnershipYesAnswer).toBeInTheDocument()
    expect(corporateOfficerOrStockOwnershipYesAnswer).not.toBeChecked()
    expect(corporateOfficerOrStockOwnershipNoAnswer).toBeInTheDocument()
    expect(corporateOfficerOrStockOwnershipNoAnswer).not.toBeChecked()

    expect(queryForSoleProprietorshipQuestion()).not.toBeInTheDocument()
    expect(queryForRelatedToOwnerQuestion()).not.toBeInTheDocument()
  })

  describe('sole proprietorship question', () => {
    it('is shown/hidden & cleared by the corporate officer question', async () => {
      const user = userEvent.setup()

      const {
        corporateOfficerOrStockOwnershipYesAnswer,
        corporateOfficerOrStockOwnershipNoAnswer,
        queryForSoleProprietorshipQuestion,
        queryForSoleProprietorshipYesAnswer,
        queryForSoleProprietorshipNoAnswer,
      } = renderBusinessInterests()

      expect(queryForSoleProprietorshipQuestion()).not.toBeInTheDocument()

      // Trigger the sole proprietorship question appearing
      await user.click(corporateOfficerOrStockOwnershipNoAnswer)

      expect(queryForSoleProprietorshipQuestion()).toBeInTheDocument()

      const soleProprietorshipYesAnswer = queryForSoleProprietorshipYesAnswer()
      const soleProprietorshipNoAnswer = queryForSoleProprietorshipNoAnswer()

      expect(soleProprietorshipYesAnswer).toBeInTheDocument()
      expect(soleProprietorshipYesAnswer).not.toBeChecked()
      expect(soleProprietorshipNoAnswer).toBeInTheDocument()
      expect(soleProprietorshipNoAnswer).not.toBeChecked()

      // Select an answer to the sole proprietorship question
      await user.click(soleProprietorshipYesAnswer as HTMLElement)

      expect(soleProprietorshipYesAnswer).toBeChecked()

      // Make the sole proprietorship question disappear
      await user.click(corporateOfficerOrStockOwnershipYesAnswer)

      expect(queryForSoleProprietorshipQuestion()).not.toBeInTheDocument()

      // Make the sole proprietorship question re-appear, with its value cleared
      await user.click(corporateOfficerOrStockOwnershipNoAnswer)

      expect(queryForSoleProprietorshipYesAnswer()).not.toBeChecked()
    })
  })

  describe('the related to owner question', () => {
    it('is shown/hidden & cleared by the sole proprietorship question', async () => {
      const user = userEvent.setup()

      const {
        corporateOfficerOrStockOwnershipNoAnswer,
        queryForSoleProprietorshipYesAnswer,
        queryForSoleProprietorshipNoAnswer,
        queryForRelatedToOwnerQuestion,
        queryForRelatedToOwnerNoAnswer,
        queryForRelatedToOwnerSpouseAnswer,
        queryForRelatedToOwnerParentAnswer,
        queryForRelatedToOwnerChildAnswer,
      } = renderBusinessInterests()

      // Trigger the sole proprietorship question appearing
      await user.click(corporateOfficerOrStockOwnershipNoAnswer)

      const soleProprietorshipYesAnswer = queryForSoleProprietorshipYesAnswer()
      const soleProprietorshipNoAnswer = queryForSoleProprietorshipNoAnswer()

      expect(soleProprietorshipYesAnswer).toBeInTheDocument()
      expect(soleProprietorshipNoAnswer).toBeInTheDocument()

      // Make the related to owner question appear
      await user.click(soleProprietorshipYesAnswer as HTMLElement)

      expect(soleProprietorshipYesAnswer).toBeChecked()
      expect(queryForRelatedToOwnerQuestion()).toBeInTheDocument()

      const relatedToOwnerNoAnswer = queryForRelatedToOwnerNoAnswer()
      const relatedToOwnerSpouseAnswer = queryForRelatedToOwnerSpouseAnswer()
      const relatedToOwnerParentAnswer = queryForRelatedToOwnerParentAnswer()
      const relatedToOwnerChildAnswer = queryForRelatedToOwnerChildAnswer()

      expect(relatedToOwnerNoAnswer).toBeInTheDocument()
      expect(relatedToOwnerNoAnswer).not.toBeChecked()
      expect(relatedToOwnerSpouseAnswer).toBeInTheDocument()
      expect(relatedToOwnerSpouseAnswer).not.toBeChecked()
      expect(relatedToOwnerParentAnswer).toBeInTheDocument()
      expect(relatedToOwnerParentAnswer).not.toBeChecked()
      expect(relatedToOwnerChildAnswer).toBeInTheDocument()
      expect(relatedToOwnerChildAnswer).not.toBeChecked()

      // Check an option
      await user.click(relatedToOwnerParentAnswer as HTMLElement)

      expect(relatedToOwnerParentAnswer).toBeChecked()

      // Make the related to owner question disappear
      await user.click(soleProprietorshipNoAnswer as HTMLElement)

      expect(queryForRelatedToOwnerQuestion()).not.toBeInTheDocument()

      // Make the related to owner question re-appear with its value cleared
      await user.click(queryForSoleProprietorshipYesAnswer() as HTMLElement)

      expect(queryForRelatedToOwnerParentAnswer()).not.toBeChecked()
    })

    it('is hidden and cleared by the business ownership question', async () => {
      const user = userEvent.setup()

      const {
        corporateOfficerOrStockOwnershipYesAnswer,
        corporateOfficerOrStockOwnershipNoAnswer,
        queryForSoleProprietorshipQuestion,
        queryForSoleProprietorshipYesAnswer,
        queryForRelatedToOwnerQuestion,
        queryForRelatedToOwnerNoAnswer,
        queryForRelatedToOwnerSpouseAnswer,
        queryForRelatedToOwnerParentAnswer,
        queryForRelatedToOwnerChildAnswer,
      } = renderBusinessInterests()

      // Trigger the sole proprietorship question appearing
      await user.click(corporateOfficerOrStockOwnershipNoAnswer)

      const soleProprietorshipYesAnswer = queryForSoleProprietorshipYesAnswer()

      expect(soleProprietorshipYesAnswer).toBeInTheDocument()

      // Make the related to owner question appear
      await user.click(soleProprietorshipYesAnswer as HTMLElement)

      expect(soleProprietorshipYesAnswer).toBeChecked()
      expect(queryForRelatedToOwnerQuestion()).toBeInTheDocument()

      const relatedToOwnerNoAnswer = queryForRelatedToOwnerNoAnswer()
      const relatedToOwnerSpouseAnswer = queryForRelatedToOwnerSpouseAnswer()
      const relatedToOwnerParentAnswer = queryForRelatedToOwnerParentAnswer()
      const relatedToOwnerChildAnswer = queryForRelatedToOwnerChildAnswer()

      expect(relatedToOwnerNoAnswer).toBeInTheDocument()
      expect(relatedToOwnerNoAnswer).not.toBeChecked()
      expect(relatedToOwnerSpouseAnswer).toBeInTheDocument()
      expect(relatedToOwnerSpouseAnswer).not.toBeChecked()
      expect(relatedToOwnerParentAnswer).toBeInTheDocument()
      expect(relatedToOwnerParentAnswer).not.toBeChecked()
      expect(relatedToOwnerChildAnswer).toBeInTheDocument()
      expect(relatedToOwnerChildAnswer).not.toBeChecked()

      // Check an option
      await user.click(relatedToOwnerParentAnswer as HTMLElement)

      expect(relatedToOwnerParentAnswer).toBeChecked()

      // Make the both questions disappear
      await user.click(corporateOfficerOrStockOwnershipYesAnswer)

      expect(queryForSoleProprietorshipQuestion()).not.toBeInTheDocument()

      // Make the sole proprietorship question re-appear, with its value cleared
      await user.click(corporateOfficerOrStockOwnershipNoAnswer)

      expect(queryForSoleProprietorshipYesAnswer()).not.toBeChecked()

      // Make the related to owner question re-appear with its value cleared
      await user.click(queryForSoleProprietorshipYesAnswer() as HTMLElement)

      expect(queryForRelatedToOwnerParentAnswer()).not.toBeChecked()
    })
  })
})
