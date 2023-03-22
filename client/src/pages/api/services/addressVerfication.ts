import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  console.log('addressVerfication pre-promise')
  return new Promise(() => {
    fetch(
      'http://la-clmusps-ha-s.njdol.ad.dol/AccumailRest/api/Address?street=1600+Pennsylvania+Ave&zip=20500'
    )
      .then((response) => {
        console.log('addressVerfication then called')
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'max-age=180000')
        res.end(JSON.stringify(response))
        console.log('addressVerfication prints:', res)
      })
      .catch((error) => {
        res.json(error)
        res.status(405).end()
      })
  })
}
