import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("src/components/Map"), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Card Game</title>
        <meta name="description" content="It's a Card Game" />
      </Head>
      <MapWithNoSSR />
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;

export default Home;
