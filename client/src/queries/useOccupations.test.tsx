import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useOccupationsSearch } from './useOccupations'
import axios from 'axios'
import { OccupationsSearchRequest } from 'pages/api/occupations/search'

jest.mock('axios')
const mockAxios = axios as jest.Mocked<typeof axios>

const wrapper = ({ children }: any) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useOccupationsSearch', () => {
  beforeEach(() => {
    mockAxios.post.mockReset()
  })

  it("doesn't search if the job title is blank", async () => {
    const { result } = renderHook(
      () => useOccupationsSearch({ job_title: '', job_description: '' }),
      { wrapper }
    )

    await waitFor(() => {
      expect(mockAxios.post).not.toHaveBeenCalled()
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeUndefined()
    })
  })

  it('sends request to API', async () => {
    renderHook(
      () =>
        useOccupationsSearch({
          job_title: 'test title',
          job_description: 'test description',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/occupations/search', {
        job_title: 'test title',
        job_description: 'test description',
      })
    })
  })

  it('searches occupations when the title and description are set', async () => {
    const mockOccupations = [
      {
        job_code: '1234',
        job_title: 'Software developer',
        job_description: 'Mock job description',
      },
    ]
    mockAxios.post.mockResolvedValueOnce({
      data: {
        occupations: mockOccupations,
      },
    })

    const { result } = renderHook(
      () =>
        useOccupationsSearch({
          job_title: 'software engineer',
          job_description: 'good at googling',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
      expect(result.current.data).toBe(mockOccupations)
    })
  })

  it('searches occupations when the title changes', async () => {
    mockAxios.post.mockResolvedValue({
      data: { occupations: [] },
    })
    const requestOne = {
      job_title: 'software engineer',
      job_description: 'good at googling',
    }

    const { rerender, unmount } = renderHook(
      (data: OccupationsSearchRequest = requestOne) =>
        useOccupationsSearch(data),
      { wrapper }
    )

    rerender(requestOne)
    rerender({ ...requestOne, job_title: 'farmer' })

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledTimes(2)
    })

    unmount()
  })

  it("returns undefined when there's an error", async () => {
    jest.spyOn(console, 'error').mockImplementation(() => null)
    mockAxios.post.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    })

    const { result } = renderHook(
      () =>
        useOccupationsSearch({
          job_title: 'software engineer',
          job_description: 'good at googling',
        }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
      expect(result.current.data).toBeUndefined()
    })
  })
})
