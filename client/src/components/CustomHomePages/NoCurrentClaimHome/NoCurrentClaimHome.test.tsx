import { render, screen } from '@testing-library/react'
import { NoCurrentClaimHome } from './NoCurrentClaimHome'

describe('DevHome', () => {
  it('renders without error', () => {
    render(<NoCurrentClaimHome />)
    expect(screen.getByText('preface'))
    const level2Headings = screen.getAllByRole('heading', { level: 2 })
    level2Headings &&
      expect(level2Headings[0]).toHaveTextContent('how_to_apply')
    expect(screen.getByText('process_list_1_header'))
    expect(screen.getByText('process_list_2_header'))
    expect(screen.getByText('process_list_3_header'))
    expect(screen.getByText('process_list_1_content'))
    expect(screen.getByText('process_list_1_bullet_pi'))
    expect(screen.getByText('process_list_1_bullet_work_history'))
    expect(screen.getByText('process_list_1_wh_1_sub_emp_name'))
    expect(screen.getByText('process_list_1_wh_2_sub_emp_addr'))
    expect(screen.getByText('process_list_1_wh_3_sub_emp_phone'))
    expect(screen.getByText('process_list_1_wh_4_sub_emp_dates'))
    expect(screen.getByText('process_list_1_wh_5_sub_emp_reason'))
    expect(screen.getByText('process_list_1_bullet_payments'))
    expect(screen.getByText('process_list_1_bullet_alien'))
    expect(screen.getByText('process_list_1_bullet_military'))
    expect(screen.getByText('process_list_1_bullet_sf8'))
    expect(screen.getByText('process_list_1_bullet_bank'))
    expect(screen.getByText('process_list_2_content'))
    expect(screen.getByText('process_list_3_content'))
    expect(screen.getByText('screener_title'))
    expect(screen.getByText('continue_to_get_ssn_button_name'))
    expect(screen.getByText('data_privacy_title'))
    expect(screen.getByText('data_privacy_content'))
  })
})
