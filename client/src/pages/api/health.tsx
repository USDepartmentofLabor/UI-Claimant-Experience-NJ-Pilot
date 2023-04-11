import { NextApiRequest, NextApiResponse } from 'next'

// Endpoint for container, load balancer, or other system health checks
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ status: 'OK' })
}
