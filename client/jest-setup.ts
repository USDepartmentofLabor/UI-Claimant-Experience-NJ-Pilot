// Ensures that jest is run with the jest-dom library by default on all test files
import '@testing-library/jest-dom'

const mockI18next = {
  useTranslation: () => {
    return {
      t: (str: string) => str,
    }
  },
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
  Trans: ({ i18nKey }: { i18nKey: string }) => i18nKey,
}

jest.mock('react-i18next', () => mockI18next)
jest.mock('next-i18next', () => mockI18next)
