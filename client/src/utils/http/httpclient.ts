import axios from 'axios'

const httpclient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL ?? 'http://localhost:8080',
})

export default httpclient
