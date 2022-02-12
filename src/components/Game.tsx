import styled from "styled-components";
import { useImmerReducer } from "use-immer";
import _ from "lodash";

import DisplayCards from "src/components/DisplayCards";
import DisplayBoardRow, {BoardRowType} from "src/components/DisplayBoardRow"
import cardLibrary, { CardType } from "src/cardLibrary";

type CardsType = {
  hand: Array<CardType>;
  drawPile: Array<CardType>;
  playerBoard: BoardRowType;
};

type ActionType = {
  type: string;
};

// TODO: make deck for real
const deck = [
  { ...cardLibrary.frog },
  { ...cardLibrary.dog },
  { ...cardLibrary.frog },
];

const cardsReducer = (cards: CardsType, action: ActionType) => {
  switch (action.type) {
    case "drew": {
      // move card from draw pile to hand
      const card = cards.drawPile.pop();
      if (card) {
        cards.hand.push(card);
      }
      return cards;
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

const initialCards: CardsType = {
  hand: [],
  // NOTE: could make the randomness of shuffle based on a seed
  // so games are repeatable
  drawPile: _.shuffle(_.cloneDeep(deck)),
  playerBoard: [null, null, null, null],
};

const Game = () => {
  const [cards, dispatch] = useImmerReducer(cardsReducer, initialCards);
  console.log(cards);

  const opponentBoard: BoardRowType = [null, null, null, null];

  const drawCard = () => {
    dispatch({ type: "drew" });
  };

  return (
    <Container>
      <h1>Board:</h1>
      <DisplayBoardRow cards={opponentBoard} />
      <DisplayBoardRow cards={cards.playerBoard} />

      <h1>Hand:</h1>
      <DisplayCards cards={cards.hand} />
      <button onClick={drawCard}>Draw Card</button>

      <h1>Draw Pile:</h1>
      <DisplayCards cards={cards.drawPile} />

      <h1>Deck:</h1>
      <DisplayCards cards={deck} />
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;

export default Game;
