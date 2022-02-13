import styled from "styled-components";
import { useImmerReducer } from "use-immer";
import { useState } from "react";
import _, { delay } from "lodash";

import DisplayCards from "src/components/DisplayCards";
import DisplayHand from "src/components/DisplayHand";
import DisplayBoardRow, { BoardRowType } from "src/components/DisplayBoardRow";
import cardLibrary, { CardType } from "src/cardLibrary";

function sleep(delayMs: number): Promise<void> {
  return new Promise((res) => setTimeout(res, delayMs));
}

type GameStateType = {
  hand: Array<CardType>;
  drawPile: Array<CardType>;
  playerBoard: BoardRowType;
  opponentBoard: BoardRowType;
  playerScore: number;
  opponentScore: number;
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

const gameStateReducer = (gameState: GameStateType, action: ActionType) => {
  switch (action.type) {
    case "draw_card": {
      // move card from draw pile to hand
      const card = gameState.drawPile.pop();
      if (card) {
        gameState.hand.push(card);
      }
      return gameState;
    }
    case "play_card": {
      const handIdx = action.handIdx;
      const boardIdx = action.boardIdx;
      const playable =
        handIdx >= 0 &&
        handIdx < gameState.hand.length &&
        boardIdx >= 0 &&
        boardIdx < gameState.playerBoard.length;
      if (playable) {
        const [card] = gameState.hand.splice(handIdx, 1);
        gameState.playerBoard[boardIdx] = card;
      }
      return gameState;
    }
    case "attack": {
      const idx = action.idx;
      let attackerCards = null;
      let victimCards = null;
      if (action.attacker === "player") {
        attackerCards = gameState.playerBoard;
        victimCards = gameState.opponentBoard;
      } else {
        attackerCards = gameState.opponentBoard;
        victimCards = gameState.playerBoard;
      }

      // TODO: bifurcated strikes
      const attackerCard = attackerCards[idx];
      const victimCard = victimCards[idx];
      if (attackerCard != null) {
        if (victimCard != null) {
          victimCard.health -= attackerCard.attack;
          if (victimCard.health <= 0) {
            // Remove victim cards with zero health
            victimCards[idx] = null;
          }
        } else {
          if (action.attacker === "player") {
            gameState.playerScore += attackerCard.attack;
          } else {
            gameState.opponentScore += attackerCard.attack;
          }
        }
      }

      return gameState;
    }
    default: {
      throw Error("Unknown action.");
    }
  }
};

const initialGameState: GameStateType = {
  hand: [],
  // NOTE: could make the randomness of shuffle based on a seed
  // so games are repeatable
  drawPile: _.shuffle(_.cloneDeep(deck)),
  playerBoard: [cardLibrary.dog, null, null, null],
  opponentBoard: [null, cardLibrary.frog, null, null],
  playerScore: 0,
  opponentScore: 0,
};

const Game = () => {
  const [gameState, dispatch] = useImmerReducer(
    gameStateReducer,
    initialGameState
  );
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  // TODO: set/unset this based on whether the animations are still playing
  const [playerTurn, setPlayerTurn] = useState(true);

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

  const attack = async (
    attackerCards: BoardRowType,
    direction: "player" | "opponent"
  ) => {
    for (let i = 0; i < attackerCards.length; i++) {
      let card = attackerCards[i];
      if (card != null) {
        dispatch({ type: "attack", idx: i, attacker: direction });
        await sleep(100);
      }
    }
  };
  const endTurn = async () => {
    // setPlayerTurn(false); while the animations play out

    // Player Attacks
    attack(gameState.playerBoard, "player");
    await sleep(100);
    // Opponent Attacks
    attack(gameState.opponentBoard, "opponent");
  };

  return (
    <Container>
      <h1>Score:</h1>
      <div>
        Player: {gameState.playerScore} | Opponent: {gameState.opponentScore}
      </div>
      <h1>Board:</h1>
      <button onClick={endTurn}>End Turn</button>
      <DisplayBoardRow cards={gameState.opponentBoard} />
      <DisplayBoardRow
        cards={gameState.playerBoard}
        playCard={playCard}
        activeCardSlot={null}
      />

      <h1>Hand:</h1>
      <DisplayHand
        cards={gameState.hand}
        selected={selectedCard}
        onSelect={onSelect}
      />
      <button onClick={drawCard}>Draw Card</button>

      <h1>Draw Pile:</h1>
      <DisplayCards cards={gameState.drawPile} />

      <h1>Deck:</h1>
      <DisplayCards cards={deck} />
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
`;

export default Game;
