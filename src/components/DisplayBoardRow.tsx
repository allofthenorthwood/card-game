import styled from "styled-components";
import Card, { EmptyCardSlot } from "src/components/Card";
import { CardType } from "src/cardLibrary";
import { Tuple } from "src/types";
import UnstyledButton from "src/components/UnstyledButton";

export type BoardRowType = Tuple<CardType | null, 4>;

const DisplayBoardRow = ({
  cards,
  playCard,
  activeCardSlot,
}: {
  cards: BoardRowType;
  playCard?(slot: number): void;
  activeCardSlot?: number | null;
}) => {
  return (
    <CardsContainer>
      {cards.map((card, slot) => {
        return (
          <div key={slot}>
            {card ? (
              <CardWrapper active={activeCardSlot === slot}>
                <Card {...card} key={slot} />
              </CardWrapper>
            ) : playCard ? (
              <UnstyledButton onClick={() => playCard(slot)}>
                <EmptyCardSlot />
              </UnstyledButton>
            ) : (
              <EmptyCardSlot />
            )}
          </div>
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

const CardWrapper = styled.div<{ active: boolean }>`
  ${(props) => (props.active ? "box-shadow: 0 0 0 2px red" : "")};
`;

export default DisplayBoardRow;
