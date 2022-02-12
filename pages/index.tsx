import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { useReducer } from "react";
import Game from "src/components/Game";
import dynamic from 'next/dynamic'

const GameWithNoSSR = dynamic(
  () => import('src/components/Game'),
  { ssr: false }
)

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Card Game</title>
        <meta name="description" content="It's a Card Game" />
      </Head>
      <GameWithNoSSR />
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;
const CardsContainer = styled.div`
  display: flex;
  & > div {
    margin: 5px;
  }
`;

export default Home;
