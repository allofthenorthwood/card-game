import styled from "styled-components";
import Card, { cardShape, EmptyCardSlot } from "src/components/Card";
import { CardType } from "src/cardLibrary";
import { Tuple } from "src/types";
import UnstyledButton from "src/components/UnstyledButton";
import { useSpring, animated } from "react-spring";

export type BoardRowType = Tuple<CardType | null, 4>;

const DisplayBoardRow = ({
  cards,
  playCard,
  activeCardSlot,
  reverseActiveDirection,
}: {
  cards: BoardRowType;
  playCard?(slot: number): void;
  activeCardSlot?: number | null;
  reverseActiveDirection?: boolean;
}) => {
  return (
    <CardsContainer>
      {cards.map((card, slot) => {
        const top =
          activeCardSlot === slot ? (reverseActiveDirection ? 20 : -20) : 0;
        const animProps = useSpring({ to: { top }, from: { top: 0 } });
        return (
          <SlotWrapper key={slot} active={activeCardSlot === slot}>
            {card ? (
              <CardWrapper
                active={activeCardSlot === slot}
                reverse={reverseActiveDirection}
                style={animProps}
              >
                <Card {...card} key={slot} />
              </CardWrapper>
            ) : playCard ? (
              <UnstyledButton onClick={() => playCard(slot)}>
                <EmptyCardSlot />
              </UnstyledButton>
            ) : (
              <EmptyCardSlot />
            )}
          </SlotWrapper>
        );
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

const CardWrapper = styled(animated.div)<{
  active: boolean;
  reverse?: boolean;
}>`
  position: absolute;
  z-index: ${(props) => (props.active ? 1 : 0)};
`;
const SlotWrapper = styled.div<{ active: boolean }>`
  ${cardShape}
  position: relative;
  background: ${(props) => (props.active ? "#aaa" : "#ddd")};
`;

export default DisplayBoardRow;
