//TODO: resolve - Jest does not fully render elements nested within translation objects
/*import { render, screen } from '@testing-library/react'
import { NoCurrentClaimHome } from './NoCurrentClaimHome'
import userEvent from '@testing-library/user-event'
import React from 'react'


describe('DevHome', () => {
  it('renders without error', () => {
    render(<NoCurrentClaimHome />)
    expect(screen.getByText('preface'))
    expect(screen.getByRole('heading', { level: 2 })).toContain('how_to_apply')
    expect(screen.getByText('process_list_1_header'))
    expect(screen.getByText('process_list_1_content'))
    expect(screen.getByText('process_list_2_header'))
    expect(screen.getByText('process_list_2_content'))
    expect(screen.getByText('process_list_3_header'))
    expect(screen.getByText('process_list_3_content'))
    expect(screen.getByText('screener_title'))
    expect(screen.getByText('continue_to_get_ssn_button_name'))
    expect(screen.getByText('data_privacy_title'))
    expect(screen.getByText('data_privacy_content'))
  })

  it('clicking button navigates properly without ssn', async () => {
    const user = userEvent.setup()
    render(<NoCurrentClaimHome />)

    const eligibilityLink = screen.getByLabelText('preface_link_aria')
    eligibilityLink && (await user.click(eligibilityLink))

    await expect(eligibilityLink).resolves.toBeCalledTimes(1)
  })
})*/
