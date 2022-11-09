import { useClearFields } from 'hooks/useClearFields'
import { renderHook } from '@testing-library/react-hooks'

jest.mock('formik')
import { useFormikContext } from 'formik'
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

    it('can clear a single field', () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      mockGetFieldMeta.mockReturnValueOnce({
        value: 'some non default value',
        touched: true,
      })

      clearField(fieldName)

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(1)
      expect(mockSetFieldValue).toHaveBeenCalledWith(fieldName, undefined)

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(1)
      expect(mockSetFieldTouched).toHaveBeenCalledWith(fieldName, false)
    })

    it('does not try to clear a single field if the state is already as desired', () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      mockGetFieldMeta.mockReturnValueOnce({
        value: undefined,
        touched: false,
      })

      clearField(fieldName)

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(0)

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(0)
    })

    it('can clear a single configured field', () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      mockGetFieldMeta.mockReturnValueOnce({
        value: 'some non default value',
        touched: false,
      })

      const desiredClearedValue = 'desired value'
      const desiredClearedTouched = true

      clearField({
        fieldName,
        value: desiredClearedValue,
        touched: desiredClearedTouched,
      })

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(1)
      expect(mockSetFieldValue).toHaveBeenCalledWith(
        fieldName,
        desiredClearedValue
      )

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(1)
      expect(mockSetFieldTouched).toHaveBeenCalledWith(
        fieldName,
        desiredClearedTouched
      )
    })

    it('does not try to clear a single configured field if the state is already as desired', () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      const desiredClearedValue = 'desired value'
      const desiredClearedTouched = true

      mockGetFieldMeta.mockReturnValueOnce({
        value: desiredClearedValue,
        touched: desiredClearedTouched,
      })

      clearField({
        fieldName,
        value: desiredClearedValue,
        touched: desiredClearedTouched,
      })

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(0)

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(0)
    })

    it('can clear a single configured field omitting value and touched in order to use the defaults', () => {
      const { result } = renderHook(() => useClearFields())
      const { clearField } = result.current

      mockGetFieldMeta.mockReturnValueOnce({
        value: 'some non default value',
        touched: true,
      })

      clearField({
        fieldName,
      })

      expect(mockGetFieldMeta).toHaveBeenCalledTimes(1)
      expect(mockGetFieldMeta).toHaveBeenCalledWith(fieldName)

      expect(mockSetFieldValue).toHaveBeenCalledTimes(1)
      expect(mockSetFieldValue).toHaveBeenCalledWith(fieldName, undefined)

      expect(mockSetFieldTouched).toHaveBeenCalledTimes(1)
      expect(mockSetFieldTouched).toHaveBeenCalledWith(fieldName, false)
    })
  })
})
