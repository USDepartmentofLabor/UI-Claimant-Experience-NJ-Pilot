export const convertCentsToDollars = (cents: string): string =>
  (Number(cents) / 100).toFixed(2)

export const convertCentsToDollarsAsTyped = (
  cents: string,
  length: number
): string => String(Number(cents) / 100).substring(0, length + 1)

export const convertDollarsToCents = (dollars: string): string =>
  (Number(dollars) * 100).toFixed()
