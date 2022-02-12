import styled from "styled-components";
import { useImmerReducer } from "use-immer";
import { useState } from "react";
import _ from "lodash";

import DisplayCards from "src/components/DisplayCards";
import DisplayHand from "src/components/DisplayHand";
import DisplayBoardRow, { BoardRowType } from "src/components/DisplayBoardRow";
import cardLibrary, { CardType } from "src/cardLibrary";

type CardsType = {
  hand: Array<CardType>;
  drawPile: Array<CardType>;
  playerBoard: BoardRowType;
};

type ActionType = {
  type: string;
  handIdx?: number;
  boardIdx?: number;
};

// TODO: make deck for real
const deck = [
  { ...cardLibrary.frog },
  { ...cardLibrary.dog },
  { ...cardLibrary.frog },
];

const cardsReducer = (cards: CardsType, action: ActionType) => {
  switch (action.type) {
    case "draw_card": {
      // move card from draw pile to hand
      const card = cards.drawPile.pop();
      if (card) {
        cards.hand.push(card);
      }
      return cards;
    }
    case "play_card": {
      const handIdx = action.handIdx;
      const boardIdx = action.boardIdx;
      const playable =
        handIdx != null &&
        handIdx >= 0 &&
        handIdx < cards.hand.length &&
        boardIdx != null &&
        boardIdx >= 0 &&
        boardIdx < cards.playerBoard.length;
      if (playable) {
        const [card] = cards.hand.splice(handIdx, 1);
        cards.playerBoard[boardIdx] = card;
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
  playerBoard: [cardLibrary.dog, null, null, null],
};

const Game = () => {
  const [cards, dispatch] = useImmerReducer(cardsReducer, initialCards);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const opponentBoard: BoardRowType = [null, null, null, null];

  const drawCard = () => {
    dispatch({ type: "draw_card" });
  };

  const playCard = (slot: number) => {
    if (selectedCard != null) {
      dispatch({ type: "play_card", handIdx: selectedCard, boardIdx: slot });
      setSelectedCard(null);
    }
  };
  const onSelect = (cardIdx: number) => {
    setSelectedCard(cardIdx);
  };
  const endTurn = () => {};

  return (
    <Container>
      <h1>Board:</h1>
      <button onClick={endTurn}>End Turn</button>
      <DisplayBoardRow cards={opponentBoard} />
      <DisplayBoardRow cards={cards.playerBoard} playCard={playCard} />

      <h1>Hand:</h1>
      <DisplayHand
        cards={cards.hand}
        selected={selectedCard}
        onSelect={onSelect}
      />
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
