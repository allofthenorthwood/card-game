import styled from "styled-components";
import Card, {EmptyCardSlot} from "src/components/Card";
import { CardType } from "src/cardLibrary";
import { createReadStream } from "fs";

// TODO: move to helper file
type Tuple<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _TupleOf<T, N, []>
  : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _TupleOf<T, N, [T, ...R]>;

export type BoardRowType = Tuple<CardType | null, 4>;

const DisplayBoardRow = ({ cards }: { cards: BoardRowType }) => {
  return (
    <CardsContainer>
      {cards.map((card) => {
        if (card) {
          return <Card {...card}/>
        }
        return <EmptyCardSlot/>
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
