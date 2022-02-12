import type { NextPage } from 'next'
import Head from 'next/head'
import styled from "styled-components";
import Card from "../src/components/card";

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Card Game</title>
        <meta name="description" content="It's a Card Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card title="Stoat" attack={2} health={3}/>
        
    </Container>
  )
}

const Container = styled.div`
  padding: 30px;
`;

export default Home
