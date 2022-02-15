import styled from "styled-components";
import Card, { cardShape } from "src/components/Card";
import { CardType } from "src/cardLibrary";
import UnstyledButton from "src/components/UnstyledButton";
import { useSpring, animated } from "react-spring";

type CardsList = Array<CardType>;

const HandCard = ({
  selected,
  card,
  onClick,
}: {
  selected: boolean;
  card: CardType;
  onClick(): void;
}) => {
  const animProps = useSpring({
    to: { top: selected ? -20 : 0 },
    from: { top: 0 },
  });
  return (
    <CardSpot>
      <CardSpotInner style={animProps} selected={selected}>
        <UnstyledButton onClick={onClick}>
          <Card {...card} />
        </UnstyledButton>
      </CardSpotInner>
    </CardSpot>
  );
};

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
    return <EmptyHand>(Hand empty)</EmptyHand>;
  }

  return (
    <CardsContainer>
      {cards.map((card, idx) => {
        return (
          <HandCard
            selected={selected === idx}
            key={idx}
            card={card}
            onClick={() => onSelect(idx)}
          />
        );
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div``;
type CardSpotInnerType = {
  selected: boolean;
};
const CardSpot = styled(animated.div)`
  ${cardShape}
  margin-right: 5px;
  position: relative;
  padding: 2px;
  display: inline-block;
`;
const CardSpotInner = styled(animated.div)<CardSpotInnerType>`
  position: absolute;
`;

const EmptyHand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #999;
`;

export default DisplayHand;
