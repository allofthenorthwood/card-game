import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import Card from "src/components/card";
import cardLibary from "src/cardLibrary";

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Card Game</title>
        <meta name="description" content="It's a Card Game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {Object.keys(cardLibary).map((cardId) => {
        let cardData = cardLibary[cardId];
        return (
          <Card
            key={cardId}
            name={cardData.name}
            attack={cardData.attack}
            health={cardData.health}
            icon={cardData.icon}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;

export default Home;
