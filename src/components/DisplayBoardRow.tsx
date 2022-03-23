import styled from "styled-components";
import Card, { cardShape, EmptyCardSlot } from "src/components/Card";
import { PlayableCardType } from "src/cardLibrary";
import { Tuple } from "src/types";
import UnstyledButton from "src/components/UnstyledButton";
import { useSpring, animated, useTransition } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnkh } from "@fortawesome/free-solid-svg-icons";
import styleVars from "src/styleVars";

export type BoardRowType = Tuple<PlayableCardType | null, 4>;
export type BoardRowBooleanType = Tuple<boolean, 4>;
export type BoardIdxType = number; // TODO: can this be 0 | 1 | 2 | 3;

const DisplayBoardRow = ({
  cards,
  playCard,
  activeCardSlot,
  reverseActiveDirection,
  disabled,
  sacrificing,
  sacrificingCardIdxs,
  sacrificeCard,
}: {
  cards: BoardRowType;
  playCard?(slot: BoardIdxType): void;
  activeCardSlot?: BoardIdxType | null;
  reverseActiveDirection?: boolean;
  disabled?: boolean;
  sacrificing?: boolean;
  sacrificingCardIdxs?: BoardRowBooleanType;
  sacrificeCard?(slot: BoardIdxType): void;
}) => {
  return (
    <CardsContainer activeRow={activeCardSlot != null}>
      {cards.map((card, slotIdx) => {
        const active = activeCardSlot === slotIdx;
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
          <SlotWrapper key={slotIdx} $active={active} style={slotStyles}>
            {transitions((styles, item) => {
              if (!item) {
                return playCard ? (
                  <UnstyledButton
                    onClick={() => playCard(slotIdx)}
                    disabled={disabled}
                  >
                    <EmptyCardSlot />
                  </UnstyledButton>
                ) : (
                  <EmptyCardSlot />
                );
              }
              const sacrificed = sacrificingCardIdxs
                ? // TODO: check if this ignore is correct
                  // @ts-ignore - The slotIdx is an index of the board size
                  sacrificingCardIdxs[slotIdx]
                : false;

              return sacrificing && sacrificeCard ? (
                <UnstyledButton
                  onClick={() => sacrificeCard(slotIdx)}
                  disabled={disabled}
                >
                  <CardWrapper
                    style={{ ...styles, ...cardStyles }}
                    $sacrificing={sacrificing}
                    $sacrificed={sacrificed}
                  >
                    {(sacrificed || sacrificing) && (
                      <Sacrifice
                        $sacrificing={sacrificing}
                        $sacrificed={sacrificed}
                      >
                        <FontAwesomeIcon icon={faAnkh} />
                      </Sacrifice>
                    )}
                    <Card card={item} />
                  </CardWrapper>
                </UnstyledButton>
              ) : (
                <CardWrapper style={{ ...styles, ...cardStyles }}>
                  <Card card={item} />
                </CardWrapper>
              );
            })}
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
type SacrificingProps = {
  $sacrificing?: boolean;
  $sacrificed?: boolean;
};
const CardWrapper = styled(animated.div)<SacrificingProps>`
  position: absolute;

  ${(props) =>
    props.$sacrificing && !props.$sacrificed ? ":hover { cursor: alias; }" : ""}
`;
const Sacrifice = styled.div<SacrificingProps>`
  opacity: ${(props) => (props.$sacrificing && !props.$sacrificed ? "0" : "1")};
  :hover {
    opacity: ${(props) =>
      props.$sacrificing && !props.$sacrificed ? "0.7" : "1"};
  }
  border-radius: ${styleVars.cardBorderRadius}px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  font-size: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  color: #000;
  z-index: 10;
`;
const SlotWrapper = styled(animated.div)<{ $active: boolean }>`
  ${cardShape}
  position: relative;
  background: ${(props) => (props.$active ? "#aaa" : "#ddd")};
  margin: 5px;
`;

export default DisplayBoardRow;
