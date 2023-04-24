import { useFormikContext } from 'formik'
import { useEffect } from 'react'

/**
 * Given a nested object of Formik errors, returns an array of the names of the error form elements.
 *
 * For example:
 *   generateErrorFieldNames{ employer_name: "test", employer_address: { city: "Tucson", address: "123 fake st." } }
 * Returns:
 *   ["employer_name", "employer_address.city", "employer_address.address"]
 */
const generateErrorFieldNames = (
  obj: object,
  parentObjectKey?: string,
  parentArrayKey?: string
) => {
  const flattened: (string | string[])[] = []
  Object.keys(obj).map((key) => {
    const value = obj[`${key as keyof typeof obj}`]
    if (value) {
      if (Array.isArray(value)) {
        flattened.push(generateErrorFieldNames(value, undefined, key))
      } else if (typeof value === 'object') {
        const nestedKey = parentArrayKey ? `${parentArrayKey}.${key}` : key
        flattened.push(generateErrorFieldNames(value, nestedKey))
      } else {
        const name = parentObjectKey ? `${parentObjectKey}.${key}` : key
        flattened.push(name)
      }
    }
  })

  return flattened.flat()
}

/**
 * Given two elements, finds the highest one in the DOM.
 */
const findHighestElement = (
  previous: HTMLInputElement,
  current: HTMLInputElement
) => {
  return previous?.getBoundingClientRect().top <
    current?.getBoundingClientRect().top
    ? previous
    : current
}

export const useScrollToFirstError = () => {
  const { submitCount, isValid, errors } = useFormikContext()

  useEffect(() => {
    if (submitCount > 0 && !isValid) {
      const fieldErrorNames = generateErrorFieldNames(errors)
      const elementsWithErrors = fieldErrorNames
        .map(
          (name) =>
            document.querySelector<HTMLInputElement>(`[name='${name}']`) ||
            document.querySelector<HTMLInputElement>(`[id='${name}'] input`)
        )
        .filter((element) => element) as HTMLInputElement[]

      if (elementsWithErrors && elementsWithErrors.length > 0) {
        const highestElement = elementsWithErrors.reduce((prev, current) => {
          return findHighestElement(prev, current)
        })
        // Scroll to first error
        if (highestElement) {
          highestElement.focus()
          highestElement.scrollIntoView({ block: 'center' })
        }
      }
    }
  }, [submitCount, isValid])
}

/**
 * For use within a Formik tag's render body, where hooks cannot be invoked
 * directly, and must instead be called within a child component
 */
export const ErrorScroller = () => {
  useScrollToFirstError()
  return null
}
