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
      const buffer = 1;

      // width = (cardWidth - margin) * (cards.length - 1) + cardWidth * 2 + buffer;
      const newMargin = Math.max(
        Math.ceil(
          cardWidth - (width - cardWidth * 2 - buffer) / (cards.length - 1)
        ),
        25
      );
      setMargin(newMargin * -1);
    }
  }, [cards]);

  if (cards.length === 0) {
    return <EmptyHand>(Hand empty)</EmptyHand>;
  }

  return (
    <CardsContainer ref={cardsRef}>
      {cards.map((card, idx) => {
        const last = idx == cards.length - 1;
        return (
          <HandCard
            selected={selected === idx}
            hover={hoverIdx === idx}
            last={last}
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
  flex-grow: 1;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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

  color: #999;
`;

export default DisplayHand;
