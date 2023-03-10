import { render, screen } from '@testing-library/react'
import { NoCurrentClaimHome } from './NoCurrentClaimHome'

describe('DevHome', () => {
  it('renders without error', () => {
    render(<NoCurrentClaimHome />)
    expect(screen.getByText('preface'))
    expect(screen.getByText('how_to_apply'))
    expect(screen.getByText('process_list_2_header'))
    expect(screen.getByText('process_list_2_content'))
    expect(screen.getByText('process_list_3_header'))
    expect(screen.getByText('process_list_3_content'))
    expect(screen.getByText('screener_title'))
    expect(screen.getByText('continue_to_get_ssn_button_name'))
    expect(screen.getByText('data_privacy_title'))
    expect(screen.getByText('data_privacy_content'))
  })
})
