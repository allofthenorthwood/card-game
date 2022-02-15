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
        return (
          <CardWrapper key={idx}>
            <Card {...card} />
          </CardWrapper>
        );
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div``;
const CardWrapper = styled.div`
  margin: 5px;
  display: inline-block;
`;

export default DisplayCards;
