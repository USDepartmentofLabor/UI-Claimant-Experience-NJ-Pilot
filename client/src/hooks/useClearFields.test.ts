import { renderHook } from '@testing-library/react'

jest.mock('formik')
import { useFormikContext } from 'formik'
import { useClearFields } from 'hooks/useClearFields'
const mockUseFormikContext = useFormikContext as jest.Mock

describe('useClearFields hook', () => {
  const mockGetFieldMeta = jest.fn()
  const mockSetFieldValue = jest.fn()
  const mockSetFieldTouched = jest.fn()

  mockUseFormikContext.mockReturnValue({
    getFieldMeta: mockGetFieldMeta,
    setFieldValue: mockSetFieldValue,
    setFieldTouched: mockSetFieldTouched,
  })

  afterEach(() => {
    mockGetFieldMeta.mockClear()
    mockSetFieldValue.mockClear()
    mockSetFieldTouched.mockClear()
  })

  describe('clearField', () => {
    const fieldName = 'some_field_name'

    it('can clear a single field', async () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      mockGetFieldMeta.mockReturnValueOnce({
        value: 'some non default value',
        touched: true,
      })

      await clearField(fieldName, null)

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(1)
      expect(mockSetFieldValue).toHaveBeenCalledWith(fieldName, null)

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(1)
      expect(mockSetFieldTouched).toHaveBeenCalledWith(fieldName, false)
    })

    it('does not try to clear a single field if the state is already as desired', async () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      mockGetFieldMeta.mockReturnValueOnce({
        value: null,
        touched: false,
      })

      await clearField(fieldName, null)

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(0)

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(0)
    })
  })

  describe('clearFields', () => {
    const field1 = { some_field_name: 'some value' }
    const field2 = { some_other_field_name: 'some other value' }
    const fields = { ...field1, ...field2 }

    it('clears multiple fields', async () => {
      const { result } = renderHook(() => useClearFields())
      const { clearFields } = result.current

      mockGetFieldMeta.mockImplementation((fieldName: keyof typeof fields) => ({
        value: fields[`${fieldName}`],
        touched: true,
      }))

      await clearFields({ some_field_name: '', some_other_field_name: null })

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(2)
      expect(mockGetFieldMeta).toHaveBeenCalledWith('some_field_name')
      expect(mockGetFieldMeta).toHaveBeenCalledWith('some_other_field_name')

      expect(mockSetFieldValue).toHaveBeenCalledTimes(2)
      expect(mockSetFieldValue).toHaveBeenCalledWith('some_field_name', '')
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        'some_other_field_name',
        null
      )

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(2)
      expect(mockSetFieldTouched).toHaveBeenCalledWith('some_field_name', false)
      expect(mockSetFieldTouched).toHaveBeenCalledWith(
        'some_other_field_name',
        false
      )
    })
  })
})
