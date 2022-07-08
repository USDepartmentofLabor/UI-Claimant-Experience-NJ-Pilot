// Ensures that jest is run with the jest-dom library by default on all test files
import '@testing-library/jest-dom'

jest.mock('react-i18next', () => ({
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
}))
