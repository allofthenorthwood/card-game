import styled from "styled-components";
import Card from "src/components/Card";
import { CardType } from "src/cardLibrary";
import UnstyledButton from "src/components/UnstyledButton";
import styleVars from "src/styleVars";

type CardsList = Array<CardType>;

const DisplayHand = ({
  cards,
  selected,
  onSelect,
}: {
  cards: CardsList;
  selected: number | null;
  onSelect: (cardIdx: number) => void;
}) => {
  if (cards.length === 0) {
    return <div>(You have no cards in your hand)</div>;
  }

  return (
    <CardsContainer>
      {cards.map((card, idx) => {
        return (
          <CardSpot key={idx} selected={selected === idx}>
            <UnstyledButton onClick={() => onSelect(idx)}>
              <Card {...card} />
            </UnstyledButton>
          </CardSpot>
        );
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  display: flex;
`;
type CardSpotType = {
  selected: boolean;
};
const CardSpot = styled.div<CardSpotType>`
  margin-right: 5px;
  background: ${(props) => (props.selected ? "red" : "#000")};
  padding: 2px;
  border-radius: ${styleVars.borderRadius}px;
`;

export default DisplayHand;
