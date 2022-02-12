import styled from "styled-components";
import Card, { EmptyCardSlot } from "src/components/Card";
import { CardType } from "src/cardLibrary";
import { Tuple } from "src/types";
import UnstyledButton from "src/components/UnstyledButton";

export type BoardRowType = Tuple<CardType | null, 4>;

const DisplayBoardRow = ({
  cards,
  playCard,
}: {
  cards: BoardRowType;
  playCard?(slot: number): void;
}) => {
  return (
    <CardsContainer>
      {cards.map((card, slot) => {
        return (
          <div key={slot}>
            {card ? (
              <Card {...card} key={slot} />
            ) : (
              <UnstyledButton
                onClick={() => (playCard ? playCard(slot) : null)}
              >
                <EmptyCardSlot />
              </UnstyledButton>
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

export default DisplayBoardRow;
