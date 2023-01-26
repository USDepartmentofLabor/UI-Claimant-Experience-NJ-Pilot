import { render, screen } from '@testing-library/react'
import { OccupationPageDefinition } from 'constants/pages/definitions/occupationPageDefinition'
import { QueryClient, QueryClientProvider } from 'react-query'
import Occupation from 'pages/claim/occupation'

jest.mock('queries/useSaveCompleteClaim')
jest.mock('hooks/useInitialValues')
jest.mock('hooks/useSaveClaimFormValues')
jest.mock('queries/useGetPartialClaim')
jest.mock('next/router')

describe('Occupation page', () => {
  beforeEach(() => {
    render(<Occupation />)
  })

  it('renders', async () => {
    expect(screen.queryByText('choose_the_occupation')).toBeInTheDocument()
    expect(screen.queryByText('job_title.label')).toBeInTheDocument()
    expect(screen.queryByText('job_description.label')).toBeInTheDocument()
  })

  describe('Validation Schema', () => {
    describe('job_title', () => {
      it('validates with a valid value', async () => {
        const schemaSlice = {
          job_title: 'software engineer',
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
      const Page = Occupation
      expect(Page).toHaveProperty('getLayout')

      render(
        <QueryClientProvider client={new QueryClient()}>
          {Page.getLayout?.(<Page />)}
        </QueryClientProvider>
      )
      const main = screen.queryByRole('main')

      expect(main).toBeInTheDocument()
    })
  })
})
