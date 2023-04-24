import { render, screen, within } from '@testing-library/react'
import { NewJerseyBanner } from 'components/NewJerseyBanner/NewJerseyBanner'
import userEvent from '@testing-library/user-event'

describe('NewJerseyBanner Component', () => {
  const renderNewJerseyBanner = () => {
    render(<NewJerseyBanner />)

    // Get elements that are always at least present on initial render
    const banner = screen.getByRole('region', { name: 'aria_label' })
    const header = within(banner).getByRole('banner')
    const flagImg = within(header).getByTestId('nj-flag-img')
    const toggleButton = within(header).getByRole('button')

    // Query for elements that may be present
    const queryForBannerContent = () =>
      within(banner).queryByTestId('banner-content')
    const queryForDotGovGuidance = () => {
      const bannerContent = queryForBannerContent()
      return bannerContent
        ? within(bannerContent).queryByTestId('dot-gov-guidance')
        : undefined
    }

    const queryForHttpsGuidance = () => {
      const bannerContent = queryForBannerContent()
      return bannerContent
        ? within(bannerContent).queryByTestId('https-guidance')
        : undefined
    }

    return {
      banner,
      header,
      flagImg,
      toggleButton,
      queryForBannerContent,
      queryForDotGovGuidance,
      queryForHttpsGuidance,
    }
  }

  it('Renders', () => {
    const { banner, header, flagImg, toggleButton, queryForBannerContent } =
      renderNewJerseyBanner()

    const bannerContent = queryForBannerContent()

    expect(banner).toBeInTheDocument()
    expect(header).toBeInTheDocument()

    expect(header).toHaveTextContent('header_text')
    expect(header).toHaveTextContent('header_action')

    expect(flagImg).toBeInTheDocument()

    expect(toggleButton).toBeInTheDocument()

    expect(bannerContent).not.toBeVisible()
  })

  it('Opens and closes', async () => {
    const user = userEvent.setup()
    const {
      toggleButton,
      queryForBannerContent,
      queryForDotGovGuidance,
      queryForHttpsGuidance,
    } = renderNewJerseyBanner()

    expect(queryForBannerContent()).not.toBeVisible()
    expect(queryForDotGovGuidance()).not.toBeVisible()
    expect(queryForHttpsGuidance()).not.toBeVisible()

    await user.click(toggleButton)

    expect(queryForBannerContent()).toBeVisible()
    expect(queryForDotGovGuidance()).toBeVisible()
    expect(queryForHttpsGuidance()).toBeVisible()
  })
})
