export const formatStoredToDisplayPhone = (phone: string | undefined) => {
  if (!phone) {
    return undefined
  }

  if (phone.length === 10) {
    const first = phone.substring(0, 3)
    const middle = phone.substring(3, 6)
    const last = phone.substring(6)
    return `${first}-${middle}-${last}`
  } else {
    return phone
  }
}
