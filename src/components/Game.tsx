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
  activeCardIdx: number | null;
  activeCardDirection: "player" | "opponent";
  playerTurn: boolean;
  canDrawCard: boolean;
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
    }
  | {
      type: "end_turn";
    }
  | {
      type: "start_turn";
    };

// TODO: make deck for real
const deck = [
  { ...cardLibrary.frog },
  { ...cardLibrary.dog },
  { ...cardLibrary.frog },
  { ...cardLibrary.dragon },
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
      gameState.canDrawCard = false;
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
      gameState.activeCardDirection = action.attacker;
      gameState.activeCardIdx = idx;
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
    case "end_turn": {
      gameState.playerTurn = false;
      gameState.canDrawCard = false;
      // TODO: could put attacking logic in here?
      return gameState;
    }
    case "start_turn": {
      gameState.playerTurn = true;
      gameState.canDrawCard = true;
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
  activeCardIdx: null,
  activeCardDirection: "player",
  playerTurn: true,
  canDrawCard: true,
};

const Game = () => {
  const [gameState, dispatch] = useImmerReducer(
    gameStateReducer,
    initialGameState
  );
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

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
    setSelectedCard(
      selectedCard != null && selectedCard === cardIdx ? null : cardIdx
    );
  };

  const attack = async (
    attackerCards: BoardRowType,
    direction: "player" | "opponent"
  ) => {
    for (let i = 0; i < attackerCards.length; i++) {
      let card = attackerCards[i];
      dispatch({ type: "attack", idx: i, attacker: direction });

      // TODO: Align this timer with animations:
      await sleep(500);
    }
  };
  const ringBell = async () => {
    await dispatch({ type: "end_turn" });
    // Player Attacks
    await attack(gameState.playerBoard, "player");
    // Opponent Attacks
    await attack(gameState.opponentBoard, "opponent");
    await dispatch({ type: "start_turn" });
  };

  return (
    <Container>
      <h1>Score:</h1>
      <div>
        Player: {gameState.playerScore} | Opponent: {gameState.opponentScore}
      </div>
      <h1>Board:</h1>
      <button onClick={ringBell} disabled={!gameState.playerTurn}>
        End Turn
      </button>
      <DisplayBoardRow
        cards={gameState.opponentBoard}
        activeCardSlot={
          !gameState.playerTurn && gameState.activeCardDirection === "opponent"
            ? gameState.activeCardIdx
            : null
        }
        reverseActiveDirection={true}
      />
      <DisplayBoardRow
        cards={gameState.playerBoard}
        playCard={playCard}
        activeCardSlot={
          !gameState.playerTurn && gameState.activeCardDirection === "player"
            ? gameState.activeCardIdx
            : null
        }
      />

      <h1>Hand:</h1>
      <DisplayHand
        cards={gameState.hand}
        selected={selectedCard}
        onSelect={onSelect}
      />
      <button onClick={drawCard} disabled={!gameState.playerTurn}>
        Draw Card
      </button>

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
