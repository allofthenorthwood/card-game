import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import { RawCard } from "src/components/Card";
import cardLibary from "src/cardLibrary";

const Library: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Card Library</title>
      </Head>

      {Object.values(cardLibary).map((card, i) => {
        return (
          <CardSlot key={i}>
            <RawCard card={card} />
          </CardSlot>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
  display: flex;
`;

const CardSlot = styled.div`
  padding: 5px;
`;

export default Library;
