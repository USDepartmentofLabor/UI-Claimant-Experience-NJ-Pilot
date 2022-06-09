import type { NextPage } from 'next'
import Head from 'next/head'
import { Button } from '@trussworks/react-uswds'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Apply for unemployment insurance</title>
      </Head>
      <h1>Apply for unemployment insurance</h1>
      <Button type="button"> Press Me</Button>
    </div>
  )
}

export default Home
