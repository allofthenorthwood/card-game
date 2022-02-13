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
  opponentBoard: BoardRowType;
};

type ActionType =
  | {
      type: "draw_card";
    }
  | {
      type: "play_card";
      handIdx: number;
      boardIdx: number;
    }
  | {
      type: "attack";
      idx: number;
      attacker: "player" | "opponent";
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
        handIdx >= 0 &&
        handIdx < cards.hand.length &&
        boardIdx >= 0 &&
        boardIdx < cards.playerBoard.length;
      if (playable) {
        const [card] = cards.hand.splice(handIdx, 1);
        cards.playerBoard[boardIdx] = card;
      }
      return cards;
    }
    case "attack": {
      const idx = action.idx;
      let attackerCards = null;
      let victimCards = null;
      if (action.attacker === "player") {
        attackerCards = cards.playerBoard;
        victimCards = cards.opponentBoard;
      } else {
        attackerCards = cards.opponentBoard;
        victimCards = cards.playerBoard;
      }

      // TODO: bifurcated strikes
      const attackerCard = attackerCards[idx];
      const victimCard = victimCards[idx];
      if (attackerCard != null && victimCard != null) {
        victimCard.health -= attackerCard.attack;
        if (victimCard.health <= 0) {
          // Remove victim cards with zero health
          victimCards[idx] = null;
        }
      }

      return cards;
    }
    default: {
      throw Error("Unknown action.");
    }
  }
};

const initialCards: CardsType = {
  hand: [],
  // NOTE: could make the randomness of shuffle based on a seed
  // so games are repeatable
  drawPile: _.shuffle(_.cloneDeep(deck)),
  playerBoard: [cardLibrary.dog, null, null, null],
  opponentBoard: [null, cardLibrary.frog, null, null],
};

const Game = () => {
  const [cards, dispatch] = useImmerReducer(cardsReducer, initialCards);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

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

  const attack = (
    attackerCards: BoardRowType,
    victimCards: BoardRowType,
    direction: "player" | "opponent"
  ) => {
    attackerCards.forEach((card, idx) => {
      if (card != null) {
        // TODO: bifurcated strikes
        let victimCard = cards.opponentBoard[idx];
        if (!victimCard) {
          setPlayerScore((score) => score + card.attack);
        } else {
          dispatch({ type: "attack", idx: idx, attacker: "player" });
        }
      }
    });
  };
  const endTurn = () => {
    // setPlayerTurn(false); while the animations play out

    // TODO: make sure these happen in series!
    // Player Attacks
    attack(cards.playerBoard, cards.opponentBoard, "player");
    // Opponent Attacks
    //attack(cards.opponentBoard, cards.playerBoard, "opponent");
  };

  return (
    <Container>
      <h1>Score:</h1>
      <div>
        Player: {playerScore} | Opponent: {opponentScore}
      </div>
      <h1>Board:</h1>
      <button onClick={endTurn}>End Turn</button>
      <DisplayBoardRow cards={cards.opponentBoard} />
      <DisplayBoardRow
        cards={cards.playerBoard}
        playCard={playCard}
        activeCardSlot={null}
      />

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
