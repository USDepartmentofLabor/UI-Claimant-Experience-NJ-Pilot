import { render, screen, waitFor } from '@testing-library/react'
import { OccupationPageDefinition } from 'constants/pages/definitions/occupationPageDefinition'
import Occupation from 'pages/claim/occupation'
import { WrappingProviders } from 'utils/testUtils'
import { useOccupationsSearch } from 'queries/useOccupations'
import userEvent from '@testing-library/user-event'
import { SOCOccupation } from 'services/Occucoder'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('queries/useOccupations')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

const DEBOUNCE_TIME = 1000
const MOCK_OCCUPATION: Readonly<SOCOccupation> = {
  job_code: '1234',
  job_title: 'farmer',
  job_description: 'feed world',
  score: 100,
}

const mockUseOccupationsSearch = useOccupationsSearch as jest.MockedFunction<
  typeof useOccupationsSearch
>

function mockOccupationsSearchQuery(returnValues?: {
  isLoading?: boolean
  isError?: boolean
  data?: SOCOccupation[]
}) {
  const mockReturnValue = returnValues ?? {
    isLoading: false,
    isError: false,
    data: undefined,
  }
  mockUseOccupationsSearch.mockReturnValue(
    mockReturnValue as ReturnType<typeof useOccupationsSearch>
  )
}

describe('Occupation page', () => {
  it('renders', async () => {
    mockOccupationsSearchQuery()

    render(<Occupation />)

    expect(screen.queryByText('choose_the_occupation')).toBeInTheDocument()
    expect(screen.queryByText('job_title.label')).toBeInTheDocument()
    expect(screen.queryByText('job_description.label')).toBeInTheDocument()
  })

  it('searches for occupations when the user enters a job title & description', async () => {
    mockOccupationsSearchQuery()

    render(<Occupation />)
    await userEvent.type(screen.getByTestId('job_title'), 'farmer')
    await userEvent.type(
      screen.getByTestId('job_description'),
      'good at googling'
    )

    await waitFor(
      () => {
        expect(mockUseOccupationsSearch).toHaveBeenLastCalledWith({
          job_title: 'farmer',
          job_description: 'good at googling',
        })
      },
      { timeout: DEBOUNCE_TIME + 100 }
    )
  })

  it('renders occupation job code option for each search result', async () => {
    mockOccupationsSearchQuery({
      isLoading: false,
      isError: false,
      data: [MOCK_OCCUPATION],
    })

    render(<Occupation />)

    const occupationRadio = await screen.findByLabelText(/farmer/)
    expect(occupationRadio).toBeInTheDocument()
    expect(occupationRadio).toHaveAttribute('value', MOCK_OCCUPATION.job_code)
    expect(screen.queryByLabelText(/feed world/)).toBeInTheDocument()
  })

  it('renders a spinner when a search request is loading', async () => {
    mockOccupationsSearchQuery({
      isLoading: true,
      isError: false,
      data: undefined,
    })

    render(<Occupation />)

    expect(
      await screen.findByTestId('occupations-search-spinner')
    ).toBeInTheDocument()
  })

  it('sets all occucoder fields when an occupation is selected', async () => {
    mockOccupationsSearchQuery({
      isLoading: false,
      isError: false,
      data: [MOCK_OCCUPATION],
    })

    render(<Occupation />)
    userEvent.click(screen.getByLabelText(/farmer/))

    await waitFor(() => {
      expect(screen.getByTestId('occucoder_description')).toHaveValue(
        MOCK_OCCUPATION.job_description
      )
      expect(screen.getByTestId('occucoder_job_title')).toHaveValue(
        MOCK_OCCUPATION.job_title
      )
      expect(screen.getByTestId('occucoder_score')).toHaveValue(
        MOCK_OCCUPATION.score.toString()
      )
    })
  })

  it('clears the occucoder fields when the list of occupations changes', async () => {
    mockOccupationsSearchQuery({
      isLoading: false,
      isError: false,
      data: [MOCK_OCCUPATION],
    })

    render(<Occupation />)
    userEvent.click(screen.getByLabelText(/farmer/))

    await waitFor(() => {
      expect(screen.getByTestId('occucoder_description')).toHaveValue(
        MOCK_OCCUPATION.job_description
      )
      expect(screen.getByTestId('occucoder_job_title')).toHaveValue(
        MOCK_OCCUPATION.job_title
      )
      expect(screen.getByTestId('occucoder_score')).toHaveValue(
        MOCK_OCCUPATION.score.toString()
      )
    })

    // Trigger a change to the query results
    mockOccupationsSearchQuery({
      isLoading: false,
      isError: false,
      data: [{ ...MOCK_OCCUPATION, job_title: 'something else' }],
    })
    userEvent.type(screen.getByTestId('job_title'), 'something else')

    await waitFor(() => {
      expect(screen.getByTestId('occucoder_description')).toHaveValue('')
      expect(screen.getByTestId('occucoder_job_title')).toHaveValue('')
      expect(screen.getByTestId('occucoder_score')).toHaveValue('')
    })
  })

  it('disables the submit button until an occupation is selected', async () => {
    mockOccupationsSearchQuery({
      isLoading: false,
      isError: false,
      data: [MOCK_OCCUPATION],
    })

    render(<Occupation />)
    const submitButton = screen.getByRole('button', { name: /next/i })

    expect(submitButton).toBeDisabled()

    userEvent.click(screen.getByLabelText(/farmer/))

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('allows submitting the form when the occupations search has an error', async () => {
    mockOccupationsSearchQuery({
      isLoading: false,
      isError: true,
      data: undefined,
    })

    render(<Occupation />)

    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled()
  })

  describe('Validation Schema', () => {
    describe('job_title', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          job_title: 'farmer',
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_title`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          job_title: undefined,
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_title`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })

      it('fails validation with blank value', async () => {
        const schemaSlice = {
          job_title: '',
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_title`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })

      it('fails validation with an all whitespace value', async () => {
        const schemaSlice = {
          job_title: '    ',
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_title`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })

    describe('job_description', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          job_description: 'good at googling',
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_description`,
            schemaSlice
          )
        ).resolves.toBeTruthy()
      })

      it('fails validation with an invalid value', async () => {
        const schemaSlice = {
          job_description: undefined,
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_description`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })

      it('fails validation with blank value', async () => {
        const schemaSlice = {
          job_description: '',
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_description`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })

      it('fails validation with value over max length', async () => {
        const schemaSlice = {
          job_description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum pharetra sodales sem in ultrices. Cras posuere eros quis velit malesuada, et rutrum nibh consequat. In hac habitasse platea dictumst. Maecenas suscipit rhoncus quam vel vulputate. Donec pharetra dolor id dolor feugiat, sed faucibus odio auctor.',
        }

        await expect(
          OccupationPageDefinition.validationSchema.validateAt(
            `job_description`,
            schemaSlice
          )
        ).rejects.toBeTruthy()
      })
    })
  })

  describe('page layout', () => {
    it('uses the ClaimFormLayout', () => {
      mockOccupationsSearchQuery()

      render(<Occupation />)
      const Page = Occupation
      expect(Page).toHaveProperty('getLayout')

      render(
        <WrappingProviders>{Page.getLayout?.(<Page />)}</WrappingProviders>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
