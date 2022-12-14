import { render, screen } from '@testing-library/react'
import ScreenerRedirect from 'pages/screener-redirect'
import {
  IntakeAppContext,
  IntakeAppContextType,
} from 'contexts/IntakeAppContext'
import userEvent from '@testing-library/user-event'

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

  it('renders properly', () => {
    render(
      <IntakeAppContext.Provider value={mockAppContext}>
        <ScreenerRedirect />
      </IntakeAppContext.Provider>
    )

    expect(
      screen.getByRole('heading', { name: 'page_title' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: 'info_alert.title' })
    ).toBeInTheDocument()
  })

  describe('shows the correct content based on querystring values', () => {
    it('when resident of Canada', () => {
      const screenerInput = {
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

      expect(screen.getByText('canada.heading')).toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('federal.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })

    it('when not a resident of US or Canada', () => {
      const screenerInput = {
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

      expect(screen.getByText('non_resident.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('federal.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()
    })

    it('when needing to file in another state', async () => {
      const user = userEvent.setup()
      const screenerInput = {
        screener_any_work_nj: false,
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

      expect(screen.getByText('other_state.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('federal.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()

      const otherStateButton = screen.getByText('other_state.button')

      await user.click(otherStateButton)

      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith(
        'https://www.dol.gov/general/topic/unemployment-insurance/'
      )
    })

    it('when worked in the military', async () => {
      const user = userEvent.setup()
      const screenerInput = {
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

      expect(screen.getByText('military_mvp.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('federal.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()

      const militaryMvpButton = screen.getByText('military_mvp.label.button')

      await user.click(militaryMvpButton)

      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith(
        'https://secure.dol.state.nj.us/sso/XUI/#login/&realm=ui&goto=https%3A%2F%2Fclaimproxy.dol.state.nj.us%3A443%2Fnjsuccess'
      )
    })

    it('when on disability', async () => {
      const user = userEvent.setup()
      const screenerInput = {
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

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('federal.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()

      const disabilityButton = screen.getByText('disability.label.button')

      await user.click(disabilityButton)
      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith(
        'https://nj.gov/labor/myleavebenefits/worker/tdi/'
      )
    })

    it('when had federal employment', async () => {
      const user = userEvent.setup()
      const screenerInput = {
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

      expect(screen.getByText('federal.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('maritime.heading')).not.toBeInTheDocument()

      const federalButton = screen.getByText('federal.label.button')

      await user.click(federalButton)

      expect(assignMock).toHaveBeenCalledTimes(1)
      expect(assignMock).toHaveBeenCalledWith(
        'https://secure.dol.state.nj.us/sso/XUI/#login/&realm=ui&goto=https%3A%2F%2Fclaimproxy.dol.state.nj.us%3A443%2Fnjsuccess'
      )
    })

    it('when had maritime employment', () => {
      const screenerInput = {
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

      expect(screen.getByText('maritime.heading')).toBeInTheDocument()

      expect(screen.queryByText('canada.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('ip_deny.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('non_resident.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('other_state.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_mvp.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('disability.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('federal.heading')).not.toBeInTheDocument()
      expect(screen.queryByText('military_ip.heading')).not.toBeInTheDocument()
    })
  })
})
