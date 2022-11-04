import React from 'react'

import { YourEmployer } from './YourEmployer'
import { render } from '@testing-library/react'

describe('Your Employer component', () => {
  it('renders labels and radio buttons', () => {
    const { container } = render(
      <YourEmployer employerIndex={1}></YourEmployer>
    )
    expect(container.getElementsByClassName('usa-radio__input').length).toBe(2)
    expect(container.getElementsByClassName('usa-label').length).toBe(2)
  })

  it('renders text content', () => {
    const { container } = render(<YourEmployer employerIndex={0} />)
    console.log(container.firstChild?.firstChild?.textContent)
  })
})
