export const DEFAULT_VALUE = undefined
export const DEFAULT_TOUCHED = false

export type FieldWithConfiguredClear = {
  fieldName: string
  value?: unknown
  touched?: boolean
}

export type Field = string | FieldWithConfiguredClear

export const isFieldWithConfiguredClear = (
  field: Field
): field is FieldWithConfiguredClear =>
  (field as FieldWithConfiguredClear).fieldName !== undefined

export type ClearFieldFunction = (field: Field) => Promise<void>

export type ClearFieldsFunction = (fields: Field[]) => Promise<void>
