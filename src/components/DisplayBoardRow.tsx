import styled from "styled-components";
import Card, { cardShape, EmptyCardSlot } from "src/components/Card";
import { PlayableCardType } from "src/cardLibrary";
import { Tuple } from "src/types";
import UnstyledButton from "src/components/UnstyledButton";
import { useSpring, animated, useTransition } from "react-spring";

export type BoardRowType = Tuple<PlayableCardType | null, 4>;

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
    <CardsContainer activeRow={activeCardSlot != null}>
      {cards.map((card, slot) => {
        const active = activeCardSlot === slot;
        const top = active ? (reverseActiveDirection ? 20 : -20) : 0;
        const cardStyles = useSpring({
          to: { top },
          from: { top: 0 },
        });
        const slotStyles = useSpring({
          to: { background: active ? "#aaa" : "#eee" },
          from: { background: "#eee" },
        });

        const transitions = useTransition(card, {
          from: { opacity: 0, zIndex: 0 },
          to: {
            opacity: 0,
            zIndex: 100,
          },
          enter: { opacity: 1, zIndex: 0 },
          leave: { opacity: 0, zIndex: 0 },
        });

        return (
          <SlotWrapper key={slot} $active={active} style={slotStyles}>
            {transitions((styles, item) =>
              item ? (
                <CardWrapper style={{ ...styles, ...cardStyles }}>
                  <Card card={item} />
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
              )
            )}
          </SlotWrapper>
        );
      })}
    </CardsContainer>
  );
};

const CardsContainer = styled.div<{ activeRow: boolean }>`
  display: flex;
  z-index: ${(props) => (props.activeRow ? 1 : 0)};
  & > div {
  }
`;
const CardWrapper = styled(animated.div)`
  position: absolute;
`;
const SlotWrapper = styled(animated.div)<{ $active: boolean }>`
  ${cardShape}
  position: relative;
  background: ${(props) => (props.$active ? "#aaa" : "#ddd")};
  margin: 5px;
`;

export default DisplayBoardRow;
