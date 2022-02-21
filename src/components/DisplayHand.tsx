import styled from "styled-components";
import Card, { cardShape } from "src/components/Card";
import { CardType } from "src/cardLibrary";
import UnstyledButton from "src/components/UnstyledButton";
import { useState, useRef, useLayoutEffect } from "react";
import { useSpring, animated } from "react-spring";
import styleVars from "src/styleVars";

type CardsList = Array<CardType>;

const HandCard = ({
  selected,
  hover,
  setHover,
  card,
  onClick,
  last,
  margin,
}: {
  selected: boolean;
  hover: boolean;
  setHover(hovered: boolean): void;
  card: CardType;
  onClick(): void;
  last: boolean;
  margin: number;
}) => {
  const topProps = useSpring({
    to: { top: selected ? -20 : 0 },
    from: { top: 0 },
  });
  const defaultMargin = last ? 0 : margin;
  const newMargin = last ? defaultMargin : -5;
  const leftProps = useSpring({
    to: { marginRight: hover ? newMargin : defaultMargin, top: hover ? -5 : 0 },
    from: { marginRight: defaultMargin, top: 0 },
  });
  return (
    <CardSpot
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      style={leftProps}
    >
      <CardSpotInner style={topProps} selected={selected}>
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
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const cardsRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [margin, setMargin] = useState(0);
  useLayoutEffect(() => {
    const cardsEl = cardsRef.current;
    if (cardsEl && cards.length > 1) {
      const width = cardsRef.current.offsetWidth;
      const cardWidth = styleVars.cardWidth;
      const buffer = 5;

      // width = (cardWidth - margin) * cards.length + cardWidth + buffer;
      const margin = Math.ceil(
        cardWidth - (width - cardWidth - buffer) / cards.length
      );
      setMargin(margin * -1);
    }
  }, [cards]);

  if (cards.length === 0) {
    return <EmptyHand>(Hand empty)</EmptyHand>;
  }

  return (
    <CardsContainer ref={cardsRef}>
      {cards.map((card, idx) => {
        return (
          <HandCard
            selected={selected === idx}
            hover={hoverIdx === idx}
            last={idx == cards.length - 1}
            margin={margin}
            key={idx}
            card={card}
            onClick={() => onSelect(idx)}
            setHover={(hovered) => setHoverIdx(hovered ? idx : null)}
          />
        );
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  border: 1px solid red;
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
`;
type CardSpotInnerType = {
  selected: boolean;
};
const CardSpot = styled(animated.div)`
  ${cardShape}
  position: relative;
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
