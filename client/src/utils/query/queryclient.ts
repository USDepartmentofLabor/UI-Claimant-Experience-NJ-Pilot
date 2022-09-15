import { QueryClient } from 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      // Prevent re-queries on page focus
      refetchOnWindowFocus: false,
      // Cache queries up to five minutes by default
      cacheTime: 1000 * 5 * 60,
      // Queries are immediately stale. Can change on a per-query basis.
      staleTime: 0,
    },
  },
})
