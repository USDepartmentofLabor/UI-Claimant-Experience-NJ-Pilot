import { render, screen } from '@testing-library/react'
import { SignOut } from './SignOut'
import userEvent from '@testing-library/user-event'

const mockCognitoSignOut = jest.fn(() => Promise.resolve())
jest.mock('utils/signout/cognitoSignOut', () => ({
  cognitoSignOut: () => mockCognitoSignOut(),
}))

describe('SignOut', () => {
  afterEach(() => {
    mockCognitoSignOut.mockClear()
  })

  //fix here
  // it('Renders sign out button and calls mockCognitoSignOut', async () => {
  //   const user = userEvent.setup()
  //   render(<SignOut isNavLink={false} />)

  //   const signOutButton = screen.queryByText('Sign out')

  //   expect(signOutButton).toBeInTheDocument()
  //   expect(signOutButton).toHaveAttribute('type', 'button')

  //   await user.click(signOutButton as HTMLElement)

  //   expect(mockCognitoSignOut).toHaveBeenCalledTimes(1)
  // })

  it('Renders log out nav item  and calls mockCognitoSignOut', async () => {
    const user = userEvent.setup()
    render(<SignOut key="logout" isNavLink />)

    const logOutNavItem = screen.getByText('logout')

    expect(logOutNavItem).toBeInTheDocument()

    await user.click(logOutNavItem as HTMLElement)

    expect(mockCognitoSignOut).toHaveBeenCalledTimes(1)
  })
})
