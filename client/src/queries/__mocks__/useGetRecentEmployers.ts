export const useGetRecentEmployers = () => {
  return {
    /*edit the below employers with initial values as needed */
    data: [
      {
        is_imported: true,
        fein: '0123456789',
        employer_name: 'Apple',
        is_full_time: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '123 Main St',
          city: 'Seattle',
          state: 'WA',
          zipcode: '01234',
        },
        employer_phone: '123-456-7890',
        LOCAL_pay_types: [],
        payments_received: [],
      },
      {
        is_imported: true,
        fein: '9876543210',
        employer_name: 'Microsoft',
        is_full_time: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '456 First St',
          city: 'Manhattan',
          state: 'NY',
          zipcode: '12345',
        },
        employer_phone: '987-654-3210',
        LOCAL_pay_types: [],
        payments_received: [],
      },
      {
        is_imported: true,
        fein: '1208462579',
        employer_name: 'Wendys',
        is_full_time: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '789 Rick Rd',
          city: 'Trenton',
          state: 'NJ',
          zipcode: '23456',
        },
        employer_phone: '555-123-9870',
        LOCAL_pay_types: [],
        payments_received: [],
      },
      {
        is_imported: false,
        employer_name: '',
        fein: undefined,
        is_full_time: undefined,
        separation_circumstance: undefined,
        employer_address: {
          address: '',
          city: '',
          state: '',
          zipcode: '',
        },
        employer_phone: '',
        LOCAL_pay_types: [],
        payments_received: [],
      },
    ],
    isLoading: false,
  }
}
