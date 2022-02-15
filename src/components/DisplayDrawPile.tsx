import styled from "styled-components";
import Card, {
  cardShape,
  EmptyCardSlot,
  ReverseCardSlot,
} from "src/components/Card";
import { CardType } from "src/cardLibrary";
import UnstyledButton from "src/components/UnstyledButton";
import { useSpring, animated } from "react-spring";

type CardsList = Array<CardType>;

const DrawPileCard = ({ card, offset }: { card: CardType; offset: number }) => {
  return (
    <CardSpot offset={offset}>
      <ReverseCardSlot />
    </CardSpot>
  );
};

const DisplayDrawPile = ({
  cards,
  drawCard,
  disabled,
}: {
  cards: CardsList;
  drawCard: () => void;
  disabled: boolean;
}) => {
  if (cards.length === 0) {
    return <EmptyCardSlot />;
  }

  return (
    <CardsContainer>
      <UnstyledButton onClick={drawCard} disabled={disabled}>
        <>
          {cards.map((card, idx) => {
            return <DrawPileCard key={idx} offset={idx * 2} card={card} />;
          })}
        </>
      </UnstyledButton>
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  ${cardShape}
  position: relative;
`;

const CardSpot = styled.div<{ offset: number }>`
  ${cardShape}
  margin-right: 5px;
  position: absolute;
  top: ${(props) => props.offset}px;
  left: ${(props) => props.offset}px;
  padding: 2px;
  display: inline-block;
`;

export default DisplayDrawPile;
