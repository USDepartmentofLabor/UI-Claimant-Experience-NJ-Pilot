export const DEFAULT_TOUCHED = false

export type ClearFieldFunction = (
  field: string,
  value: unknown
) => Promise<void>

export type ClearFieldsFunction = (fields: {
  [field: string]: unknown
}) => Promise<void>
