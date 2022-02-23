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
  disabled,
}: {
  cards: BoardRowType;
  playCard?(slot: number): void;
  activeCardSlot?: number | null;
  reverseActiveDirection?: boolean;
  disabled?: boolean;
}) => {
  return (
    <CardsContainer>
      {cards.map((card, slot) => {
        const active = activeCardSlot === slot;
        const top = active ? (reverseActiveDirection ? 20 : -20) : 0;
        const animProps = useSpring({ to: { top }, from: { top: 0 } });

        return (
          <SlotWrapper key={slot} active={active}>
            {card ? (
              <CardWrapper style={animProps} $active={active}>
                <Card {...card} key={slot} />
              </CardWrapper>
            ) : playCard ? (
              <UnstyledButton
                onClick={() => playCard(slot)}
                disabled={disabled}
              >
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
const CardWrapper = styled(animated.div)<{ $active: boolean }>`
  position: absolute;
  z-index: ${(props) => (props.$active ? 1 : 0)};
`;
const SlotWrapper = styled.div<{ active: boolean }>`
  ${cardShape}
  position: relative;
  background: ${(props) => (props.active ? "#aaa" : "#ddd")};
`;

export default DisplayBoardRow;
