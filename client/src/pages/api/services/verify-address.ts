import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { AddressInput } from '../../../types/claimantInput'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JSON>
): Promise<any> {
  try {
    const params = convertJSONAddressToURLParams(req.body)
    const foo = await axios.get(
      'http://la-clmusps-ha-s.njdol.ad.dol/AccumailRest/api/Address?' + params
    )
    //TODO MRH convert response to an addressInput and the error codes
    console.log('verify address: ', foo.data)
    return res.status(foo.status).send(foo.data)
  } catch (error) {
    res.setHeader('Content-Type', 'text/plain')
    if (axios.isAxiosError(error)) {
      return res
        .status(error.response?.status || 500)
        .send(error.response?.data || error.message)
    }
    return res.status(400)
  }
}

const convertJSONAddressToURLParams = (params: AddressInput): string => {
  let urlParams = new URLSearchParams(params).toString()
  urlParams = urlParams.replace('address', 'street')
  urlParams = urlParams.replace('address2', 'street2')
  urlParams = urlParams.replace('zipcode', 'zip')
  console.log('url params= ', urlParams)
  return urlParams
}
