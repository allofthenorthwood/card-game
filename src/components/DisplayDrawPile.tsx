import styled from "styled-components";
import { cardShape, ReverseCardSlot } from "src/components/Card";
import { PlayableCardType } from "src/cardLibrary";
import UnstyledButton from "src/components/UnstyledButton";

type CardsList = Array<PlayableCardType>;

const DrawPileCard = ({ offset }: { offset: number }) => {
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
    return (
      <EmptyDrawPile>
        <span>Draw pile empty</span>
      </EmptyDrawPile>
    );
  }

  const offsetDistance = 2;
  return (
    <CardsContainer>
      <UnstyledButton onClick={drawCard} disabled={disabled}>
        <>
          {cards.map((card, idx) => {
            return <DrawPileCard key={idx} offset={idx * offsetDistance} />;
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

const EmptyDrawPile = styled.div`
  ${cardShape}
  border: 1px solid #ddd;
  background: #eee;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 12px;
  color: #999;
`;
const CardSpot = styled.div<{ offset: number }>`
  ${cardShape}
  margin-right: 5px;
  position: absolute;
  top: -${(props) => props.offset}px;
  right: -${(props) => props.offset}px;
  padding: 2px;
  display: inline-block;
`;

export default DisplayDrawPile;
