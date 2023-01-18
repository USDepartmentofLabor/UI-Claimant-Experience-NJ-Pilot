export type WgpmEmployer = {
  employerAddressLine1: string | null
  employerAddressLine5: string | null
  employerAddressLine4: string | null
  employerAddressLine3: string | null
  employerAddressLine2: string | null
  employerFein: string | null
  employerAddressZip: string | null
  employerName: string | null
  employerStatePayrollNumber: string | null
  employerTelephoneNumber: string | null
  employerSequenceNumber: string | null
}

export const useGetRecentEmployers = () => {
  /*edit the below employers with initial values as needed */
  const data: WgpmEmployer[] = [
    {
      employerSequenceNumber: '001',
      employerName: 'Apple',
      employerFein: '012345678900000',
      employerAddressLine1: '123 Main St',
      employerAddressLine2: 'Seattle WA',
      employerAddressLine3: null,
      employerAddressLine4: null,
      employerAddressLine5: null,
      employerAddressZip: '01234',
      employerTelephoneNumber: '1234567890',
      employerStatePayrollNumber: null,
    },
    {
      employerSequenceNumber: '002',
      employerName: 'Microsoft',
      employerFein: '987654321000000',
      employerAddressLine1: '456 First St',
      employerAddressLine2: 'Manhattan NY',
      employerAddressLine3: null,
      employerAddressLine4: null,
      employerAddressLine5: null,
      employerAddressZip: '12345',
      employerTelephoneNumber: '9876543210',
      employerStatePayrollNumber: null,
    },
    {
      employerSequenceNumber: '003',
      employerName: 'Wendys',
      employerFein: '120846257900000',
      employerAddressLine1: '789 Rick Rd',
      employerAddressLine2: 'Trenton NJ',
      employerAddressLine3: null,
      employerAddressLine4: null,
      employerAddressLine5: null,
      employerAddressZip: '23456',
      employerTelephoneNumber: '5551239870',
      employerStatePayrollNumber: null,
    },
    {
      employerSequenceNumber: '004',
      employerName: 'PLAIN OLE CLOTHES, INC.',
      employerFein: '031143718000000',
      employerAddressLine1: 'DIRECT FUTURE MAIL',
      employerAddressLine2: 'C/O TALX UC EXPRESS',
      employerAddressLine3: 'P O BOX 6001',
      employerAddressLine4: 'PEABODY MA',
      employerAddressLine5: null,
      employerAddressZip: '01961',
      employerTelephoneNumber: '6144151035',
      employerStatePayrollNumber: null,
    },
  ]

  return {
    data,
    isLoading: false,
  }
}
