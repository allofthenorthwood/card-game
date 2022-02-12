import styled from "styled-components";
import Card from "src/components/Card";
import { CardType } from "src/cardLibrary";

type CardsList = Array<CardType>;

const DisplayCards = ({ cards }: { cards: CardsList }) => {
  if (cards.length === 0) {
    return <div>(Empty)</div>;
  }

  return (
    <CardsContainer>
      {cards.map((card, idx) => {
        return <Card key={idx} {...card} />;
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  display: flex;
  & > div {
    margin: 5px;
  }
`;

export default DisplayCards;