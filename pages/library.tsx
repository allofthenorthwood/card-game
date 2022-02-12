import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import Card from "src/components/Card";
import cardLibary from "src/cardLibrary";

const Library: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Card Library</title>
      </Head>

      {Object.keys(cardLibary).map((cardId) => {
        let cardData = cardLibary[cardId];
        return (
          <Card
            key={cardId}
            {...cardData}
          />
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;

export default Library;
