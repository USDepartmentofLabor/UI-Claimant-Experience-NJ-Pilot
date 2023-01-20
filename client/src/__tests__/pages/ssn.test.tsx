import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Ssn from 'pages/ssn'
import {
  IntakeAppContext,
  IntakeAppContextType,
} from 'contexts/IntakeAppContext'
import { Routes } from 'constants/routes'

import { SsnInput } from 'types/claimantInput'
const mockMutateAsync = jest.fn()
mockMutateAsync.mockImplementation(async (ssnValue: string) => ({
  status: 200,
  ssn: ssnValue,
}))

const mockUseValidateSSN = jest.fn(() => ({
  mutateAsync: async (ssn: string) => mockMutateAsync(ssn),
}))
jest.mock('queries/useValidateSSN', () => ({
  useValidateSSN: () => mockUseValidateSSN(),
}))

const mockPush = jest.fn(async () => true)
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// const mockSuccessfulSSNVerify=()=>{
//   const mockMutateAsync = jest.fn()

//   const mockUseValidateSSN = jest.fn()
//   mockMutateAsync.mockImplementation(async () => ({
//     status: 200,
//   }))
//   mockUseValidateSSN.mockImplementation(() => ({
//     mutateAsync:  mockMutateAsync()})
//     // async() => ({
//     //   status: 200,
//     // })})
//   )
//   jest.mock('queries/useValidateSSN', () => ({
//     useSavePartialClaim: () => mockUseValidateSSN(),
//   }))

//     return mockUseValidateSSN
// }

// const setUpHook =  (status: number) => {

//   const mockMutateAsync = jest.fn()
//   const mockUseValidateSSN = jest.fn()
//   mockMutateAsync.mockImplementation(async () => ({
//     status: status,
//   }))
//   mockUseValidateSSN.mockImplementation(() => ({
//     mutateAsync: async (ssn:string) => mockMutateAsync(ssn),
//   }))

//   jest.mock('queries/useValidateSSN', () => ({
//     useValidateSSN: () => mockUseValidateSSN(),
//   }))

//   return  mockMutateAsync
// }
// const setUpSSNMock=()=>{
// jest.mock('queries/useValidateSSN')
// const mockUseValidateSSN = useValidateSSN as jest.Mock
// const mockUseValidateMutateAsync= jest.fn(async() =>{
//     return {status:200}})
// // jest.mock('queries/useValidateSSN',() => jest.fn()
// // mockUseValidateSSN.mockImplementationOnce(() => ({
// //     mutateAsync: mockUseValidateMutateAsync
// //   })))

//   // const mockUseValidateMutateAsync= jest.fn(async() =>{
//   //   return {status:200}})

// console.log(typeof(mockUseValidateSSN))
// }
// // mockUseValidateSSN.mockImplementation(() => ({
// //   mutateAsync: mockUseValidateMutateAsync
// // }))

// // return mockUseValidateMutateAsync
// // }
describe('SSN page', () => {
  it('renders without error', () => {
    render(<Ssn />)
    expect(screen.getByLabelText('label')).toBeInTheDocument()
  })
  it('can toggle showing and hiding the ssn', async () => {
    const user = userEvent.setup()
    render(<Ssn />)
    const toggle = screen.getByTestId('toggleShowNumber')
    const ssnTextField = screen.getByLabelText('label')
    expect(ssnTextField).toHaveAttribute('type', 'password')
    expect(toggle).toHaveTextContent('showSsn')
    await user.click(toggle)
    expect(ssnTextField).toHaveAttribute('type', 'text')
    expect(toggle).toHaveTextContent('hideSsn')
    await user.click(toggle)
    expect(ssnTextField).toHaveAttribute('type', 'password')
  })

  it('sets ssn', async () => {
    const user = userEvent.setup()
    const mockAppContext: IntakeAppContextType = {
      screenerInput: undefined,
      setScreenerInput: jest.fn(),
      ssnInput: undefined,
      setSsn: jest.fn(),
    }
    render(
      <IntakeAppContext.Provider value={mockAppContext}>
        <Ssn />
      </IntakeAppContext.Provider>
    )

    const ssnValue = '123-45-4444'
    await user.type(screen.getByLabelText('label'), ssnValue)
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(mockAppContext.setSsn).toHaveBeenCalledWith({ ssn: ssnValue })
  })
  it('continues to screener page when ssn is valid', async () => {
    const ssnValue = '123-45-4444'
    const user = userEvent.setup()
    mockMutateAsync.mockClear()
    const mockAppContext: IntakeAppContextType = {
      screenerInput: undefined,
      setScreenerInput: jest.fn(),
      ssnInput: { ssn: ssnValue } as SsnInput,
      setSsn: jest.fn(),
    }
    render(
      <IntakeAppContext.Provider value={mockAppContext}>
        <Ssn />
      </IntakeAppContext.Provider>
    )
    await user.click(screen.getByRole('button', { name: /next/i }))
    expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    expect(mockMutateAsync).toHaveBeenCalledWith(ssnValue)
  })

  it('Goes to the home page when cancel button is clicked', async () => {
    const user = userEvent.setup()
    mockMutateAsync.mockClear()
    const mockAppContext: IntakeAppContextType = {
      screenerInput: undefined,
      setScreenerInput: jest.fn(),
      ssnInput: undefined,
      setSsn: jest.fn(),
    }
    render(
      <IntakeAppContext.Provider value={mockAppContext}>
        <Ssn />
      </IntakeAppContext.Provider>
    )

    const ssnValue = '123-45-4444'
    await user.type(screen.getByLabelText('label'), ssnValue)
    await user.click(screen.getByRole('button', { name: /previous/i }))
    expect(mockAppContext.setSsn).not.toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith(Routes.HOME)
    expect(mockMutateAsync).toHaveBeenCalledTimes(0)
  })

  it('Applies ssn from context if available', async () => {
    const mockAppContext: IntakeAppContextType = {
      screenerInput: undefined,
      setScreenerInput: jest.fn(),
      ssnInput: { ssn: '999-88-7777' },
      setSsn: jest.fn(),
    }
    render(
      <IntakeAppContext.Provider value={mockAppContext}>
        <Ssn />
      </IntakeAppContext.Provider>
    )

    expect(screen.getByLabelText('label')).toHaveValue('999-88-7777')
  })
})
