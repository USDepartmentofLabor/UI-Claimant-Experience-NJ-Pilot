import '../src/styles/styles.scss'
import '../src/i18n/i18n'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
      order: ['Core', 'Components', 'Pages'],
    },
  },
}

const PageStoryWrapper = (props) => {
  const expirationDate = new Date()
  expirationDate.setDate(expirationDate.getDate() + 30)

  const mockSession = {
    whoAmI: {
      firstName: 'Fakey',
      middleInitial: undefined,
      lastName: 'McFakerson',
      birthdate: '1990-01-01',
      email: 'fakey@fakedomain.com',
      phone: '5555555555',
    },
    expires: expirationDate.toString(),
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <SessionProvider session={mockSession}>{props.children}</SessionProvider>
    </QueryClientProvider>
  )
}

export const decorators = [
  (Story) => (
    <PageStoryWrapper>
      <Story />
    </PageStoryWrapper>
  ),
]
