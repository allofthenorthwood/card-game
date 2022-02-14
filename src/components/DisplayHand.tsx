import styled from "styled-components";
import Card, { cardShape } from "src/components/Card";
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
          <CardSpot key={idx}>
            <CardSpotInner selected={selected === idx}>
              <UnstyledButton onClick={() => onSelect(idx)}>
                <Card {...card} />
              </UnstyledButton>
            </CardSpotInner>
          </CardSpot>
        );
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  display: flex;
`;
type CardSpotInnerType = {
  selected: boolean;
};
const CardSpot = styled.div`
  ${cardShape}
  margin-right: 5px;
  position: relative;
  padding: 2px;
  border-radius: ${styleVars.borderRadius}px;
`;
const CardSpotInner = styled.div<CardSpotInnerType>`
  position: absolute;
  top: ${(props) => (props.selected ? "-20" : "0")}px;
`;

export default DisplayHand;
