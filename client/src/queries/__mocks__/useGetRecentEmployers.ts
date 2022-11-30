export const useGetRecentEmployers = () => {
  return {
    /*edit the below employers with initial values as needed */
    data: [
      {
        name: 'Apple',
        isFullTime: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '123 Main St',
          city: 'Seattle',
          state: 'WA',
          zipcode: '01234',
        },
        employer_phone: '123-456-7890',
        isImported: true,
        LOCAL_pay_types: [],
        payments_received: [],
      },
      {
        name: 'Microsoft',
        isFullTime: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '456 First St',
          city: 'Manhattan',
          state: 'NY',
          zipcode: '12345',
        },
        employer_phone: '987-654-3210',
        isImported: true,
        LOCAL_pay_types: [],
        payments_received: [],
      },
      {
        name: 'Wendys',
        isFullTime: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '789 Rick Rd',
          city: 'Trenton',
          state: 'NJ',
          zipcode: '23456',
        },
        employer_phone: '555-123-9870',
        isImported: true,
        LOCAL_pay_types: [],
        payments_received: [],
      },
    ],
    isLoading: false,
  }
}
