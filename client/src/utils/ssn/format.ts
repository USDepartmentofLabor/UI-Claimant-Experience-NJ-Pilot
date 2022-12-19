export const getFormattedSsn = (inputSsn: string | undefined) => {
  let ssn
  if (inputSsn !== undefined) {
    if (/^[0-9]{3}-?[0-9]{2}-?[0-9]{4}$/.test(inputSsn)) {
      const ssnNoHyphens = inputSsn.split('-').join('')
      ssn = [
        ssnNoHyphens.substring(0, 3),
        ssnNoHyphens.substring(3, 5),
        ssnNoHyphens.substring(5),
      ].join('-')
    } else {
      ssn = inputSsn
    }
  }
  return ssn
}
