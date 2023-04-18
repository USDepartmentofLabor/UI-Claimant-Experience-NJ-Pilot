import { render, screen } from '@testing-library/react'
import ScreenerRedirect from 'pages/screener-redirect'
import {
  IntakeAppContext,
  IntakeAppContextType,
} from 'contexts/IntakeAppContext'
import userEvent from '@testing-library/user-event'
import { pageInitialValues } from 'pages/screener'
import { Routes } from 'constants/routes'
import { ScreenerInput } from 'types/claimantInput'

describe('Screener-redirect page', () => {
  const mockAppContext: IntakeAppContextType = {
    screenerInput: undefined,
    setScreenerInput: jest.fn(),
    setSsn: jest.fn(),
  }

  const assignMock = jest.fn()
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      assign: assignMock,
    },
  })

  afterEach(() => {
    assignMock.mockClear()
  })

  describe('shows the correct content', () => {
    it.each([
      // Simulate overlapping scenarios to ensure Canada overrules them
      {},
      { screener_maritime_employer_eighteen_months: true },
      { screener_military_service_eighteen_months: true },
    ])('when resident of Canada', (screenerInputOverrides) => {
      const screenerInput = {
        ...screenerInputOverrides,
        ...pageInitialValues,
        screener_current_country_us: false,
        screener_live_in_canada: true,
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput: screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.getByText('title_call_us')).toBeInTheDocument()
      expect(screen.getByText('warning_canada')).toBeInTheDocument()
      expect(screen.getByText('instructions_canada')).toBeInTheDocument()
    })

    it.each([
      // Simulate overlapping scenarios to ensure non resident of US and Canada overrules them
      {},
      { screener_maritime_employer_eighteen_months: true },
      { screener_military_service_eighteen_months: true },
    ])('when not a resident of US or Canada', (screenerInputOverrides) => {
      const screenerInput = {
        ...screenerInputOverrides,
        ...pageInitialValues,
        screener_current_country_us: false,
        screener_live_in_canada: false,
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput: screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.getByText('title_not_qualified')).toBeInTheDocument()
      expect(screen.getByText('non_resident.warning')).toBeInTheDocument()
      expect(screen.getByText('non_resident.instructions')).toBeInTheDocument()
    })

    it('when needing to file in another state', async () => {
      const screenerInput: ScreenerInput = {
        ...pageInitialValues,
        screener_current_country_us: true,
        screener_work_nj: 'other',
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.queryByText('title_predict_denial')).toBeInTheDocument()
      expect(screen.queryByText('other_state.warning')).toBeInTheDocument()
      expect(screen.queryByText('other_state.instructions')).toBeInTheDocument()
    })

    it('when worked in the military', async () => {
      const screenerInput = {
        ...pageInitialValues,
        screener_current_country_us: true,
        screener_military_service_eighteen_months: true,
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput: screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
    })

    it('when on disability', async () => {
      const user = userEvent.setup()
      const screenerInput = {
        ...pageInitialValues,
        screener_current_country_us: true,
        screener_currently_disabled: true,
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput: screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.getByText('disability.heading')).toBeInTheDocument()

      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()

      const disabilityButton = screen.getByText('disability.label.button')

      await user.click(disabilityButton)
      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith(
        'https://nj.gov/labor/myleavebenefits/worker/tdi/'
      )
    })

    it('when had federal employment', async () => {
      const screenerInput = {
        ...pageInitialValues,
        screener_current_country_us: true,
        screener_federal_work_in_last_eighteen_months: true,
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput: screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.getByText('title_apply_online')).toBeInTheDocument()
      expect(screen.getByText('legacy.apply_button')).toHaveAttribute(
        'href',
        Routes.LEGACY_APPLICATION
      )
    })

    it('when had maritime employment', () => {
      const screenerInput = {
        ...pageInitialValues,
        screener_current_country_us: true,
        screener_maritime_employer_eighteen_months: true,
      }

      render(
        <IntakeAppContext.Provider
          value={{
            ...mockAppContext,
            screenerInput: screenerInput,
          }}
        >
          <ScreenerRedirect />
        </IntakeAppContext.Provider>
      )

      expect(screen.getByText('title_apply_via_phone')).toBeInTheDocument()
      expect(screen.getByText('warning_maritime')).toBeInTheDocument()
      expect(
        screen.getByText('instructions_call_within_us')
      ).toBeInTheDocument()
    })
  })
})
