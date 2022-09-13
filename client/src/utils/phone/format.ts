export const formatStoredToDisplayPhone = (phone: string | undefined) => {
  if (!phone) {
    return undefined
  }
  // phone should be string.length === 9
  const first = phone.substring(0, 3)
  const middle = phone.substring(3, 6)
  const last = phone.substring(6)
  return `${first}-${middle}-${last}`
}
