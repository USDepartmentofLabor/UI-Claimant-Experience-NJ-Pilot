// TS Hack due to https://github.com/mfrachet/cypress-audit/issues/162

declare namespace Cypress {
  type AccessibilityStandard = 'Section508' | 'WCAG2A' | 'WCAG2AA' | 'WCAG2AAA'

  interface Options {
    actions?: string[]
    headers?: object
    hideElements?: string
    ignore?: string[]
    ignoreUrl?: boolean
    includeNotices?: boolean
    includeWarnings?: boolean
    level?: string
    method?: string
    postData?: string
    reporter?: string
    rootElement?: string
    runners?: string[]
    rules?: string[]
    screenCapture?: string
    standard?: AccessibilityStandard
    threshold?: number
    timeout?: number
    userAgent?: string
    wait?: number
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    /**
     * Runs a pa11y audit
     * @example
     * cy.pa11y(opts)
     */
    pa11y(opts?: Options)
  }
}
