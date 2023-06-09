import nextJest from 'next/jest'
import { Config } from '@jest/types'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleDirectories: ['node_modules', 'src/'],
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  collectCoverageFrom: [
    './src/**/*.{js,jsx,ts,tsx}',
    '!./src/i18n/**',
    '!**/*.stories.*',
    '!./src/pages/_app.tsx',
    '!./src/constants/**',
    '!./src/pages/api/auth/\\[...nextauth\\].ts',
    '!./src/middleware.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 92,
      functions: 93,
      lines: 95,
    },
  },
  coverageDirectory: 'coverage/jest',
  testTimeout: 10000,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
