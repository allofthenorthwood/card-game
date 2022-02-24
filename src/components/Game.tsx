import styled from "styled-components";
import { useImmerReducer } from "use-immer";
import { useEffect, useState } from "react";
import _ from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons";

import DisplayCards from "src/components/DisplayCards";
import DisplayHand from "src/components/DisplayHand";
import DisplayDrawPile from "src/components/DisplayDrawPile";
import DisplayBoardRow, { BoardRowType } from "src/components/DisplayBoardRow";
import {
  makePlaybleCardFromId as makeCard,
  PlayableCardType,
} from "src/cardLibrary";
import ScoreBoard from "src/components/Scoreboard";
import UnstyledButton from "src/components/UnstyledButton";
import styleVars from "src/styleVars";
import { shuffle } from "src/random";

const SCORE_LIMIT = 5; // Difference in score that ends the game
const INITIAL_HAND_SIZE = 5; // Starting number of cards in your hand

function sleep(delayMs: number): Promise<void> {
  return new Promise((res) => setTimeout(res, delayMs));
}

type GameStateType = {
  hand: Array<PlayableCardType>;
  drawPile: Array<PlayableCardType>;
  opponentDeck: Array<PlayableCardType>;
  playerBoard: BoardRowType;
  opponentBoard: BoardRowType;
  opponentNextCards: BoardRowType;
  playerScore: number;
  opponentScore: number;
  activeCardIdx: number | null;
  activeCardDirection: "player" | "opponent";
  playerTurn: boolean;
  canDrawCard: boolean;
  gameOver: boolean;
};

// TODO: make deck for real
const deck: Array<PlayableCardType> = [
  makeCard("frog"),
  makeCard("dog"),
  makeCard("frog"),
  makeCard("dragon"),
  makeCard("frog"),
  makeCard("frog"),
  makeCard("dog"),
  makeCard("frog"),
];

// TODO: make opponent deck for real
const opponentDeck: Array<PlayableCardType> = [
  makeCard("frog"),
  makeCard("dog"),
  makeCard("frog"),
  makeCard("dragon"),
];

const makeInitialGameState = () => {
  const init: GameStateType = {
    hand: [],
    drawPile: shuffle(deck),
    opponentDeck: shuffle(opponentDeck),
    playerBoard: [makeCard("dog"), null, null, null],
    opponentBoard: [null, makeCard("frog"), null, null],
    opponentNextCards: [makeCard("frog"), null, null, makeCard("dog")],
    playerScore: 0,
    opponentScore: 0,
    activeCardIdx: null,
    activeCardDirection: "player",
    playerTurn: true,
    canDrawCard: true,
    gameOver: false,
  };

  const gameState = init;
  for (let i = 0; i < INITIAL_HAND_SIZE; i++) {
    const card = gameState.drawPile.pop();
    if (card) {
      gameState.hand.push(card);
    }
  }
  return gameState;
};
const initialGameState: GameStateType = makeInitialGameState();

type ActionType =
  | {
      type: "reset_game";
    }
  | {
      type: "end_game";
    }
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

const gameStateReducer = (
  gameState: GameStateType,
  action: ActionType
): GameStateType => {
  if (gameState.gameOver) {
    if (action.type === "reset_game") {
      return makeInitialGameState();
    } else {
      return gameState;
    }
  }
  switch (action.type) {
    case "end_game": {
      gameState.gameOver = true;
      gameState.activeCardIdx = null;
      return gameState;
    }
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
        // Move new opponent cards onto the board
        let newCard = gameState.opponentNextCards[idx];
        let curCard = gameState.opponentBoard[idx];
        if (curCard == null && newCard != null) {
          gameState.opponentBoard[idx] = newCard;
          gameState.opponentNextCards[idx] = null;
        }
        attackerCards = gameState.opponentBoard;
        victimCards = gameState.playerBoard;
      }

      // TODO: bifurcated strikes
      const attackerCard = attackerCards[idx];
      const victimCard = victimCards[idx];
      if (attackerCard != null) {
        if (victimCard != null) {
          victimCard.card.health -= attackerCard.card.attack;
          if (victimCard.card.health <= 0) {
            // Remove victim cards with zero health
            victimCards[idx] = null;
          }
        } else {
          if (action.attacker === "player") {
            gameState.playerScore += attackerCard.card.attack;
          } else {
            gameState.opponentScore += attackerCard.card.attack;
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
      // Add new cards from opponent's deck
      const numCardsToAdd = 1;
      let cardsAdded = 0;
      let slots = _.range(0, 4);
      slots = shuffle(slots);
      slots.forEach((slot) => {
        if (
          cardsAdded < numCardsToAdd &&
          gameState.opponentNextCards[slot] == null
        ) {
          const card = gameState.opponentDeck.pop();
          if (card) {
            gameState.opponentNextCards[slot] = card;
            cardsAdded++;
          }
        }
      });
      return gameState;
    }
    default: {
      throw Error("Unknown action.");
    }
  }
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
      dispatch({ type: "attack", idx: i, attacker: direction });
      if (gameState.gameOver) {
        // TODO: This can't be the right way to do this
        break;
      }
      // TODO: Align this timer with animations:
      await sleep(500);
    }
  };
  const ringBell = async () => {
    dispatch({ type: "end_turn" });
    // Player Attacks
    await attack(gameState.playerBoard, "player");
    // Opponent Attacks
    await attack(gameState.opponentBoard, "opponent");
    await dispatch({ type: "start_turn" });
  };
  const resetGame = () => {
    dispatch({ type: "reset_game" });
  };

  useEffect(() => {
    const scoreDiff = gameState.playerScore - gameState.opponentScore;
    if (Math.abs(scoreDiff) >= SCORE_LIMIT) {
      // TODO: have this happen after last animation finishes
      dispatch({ type: "end_game" });
    }
  }, [gameState]);

  // TODO: handle max score diff (i.e. > 5) and pass max through to scoreboard

  // TODO: change the board into a css grid so the cards can animate from one location
  // to another
  return (
    <Container>
      {gameState.gameOver && (
        <GameOverModal>
          <h1>Game Over</h1>
          <p>
            Winner:{" "}
            {gameState.opponentScore > gameState.playerScore
              ? "Opponent"
              : "Player"}
          </p>
          <button onClick={resetGame}>Reset Game</button>
        </GameOverModal>
      )}
      <ScoreBoardContainer>
        <ScoreBoard
          playerScore={gameState.playerScore}
          opponentScore={gameState.opponentScore}
        />
      </ScoreBoardContainer>

      <Row>
        <RowLabel>Next Turn</RowLabel>
        <DisplayBoardRow
          cards={gameState.opponentNextCards}
          activeCardSlot={null}
          reverseActiveDirection={true}
        />
      </Row>

      <Row>
        <RowLabel>Opponent</RowLabel>
        <DisplayBoardRow
          cards={gameState.opponentBoard}
          activeCardSlot={
            !gameState.playerTurn &&
            gameState.activeCardDirection === "opponent"
              ? gameState.activeCardIdx
              : null
          }
          reverseActiveDirection={true}
        />
      </Row>
      <Row>
        <RowLabel>Player</RowLabel>
        <DisplayBoardRow
          cards={gameState.playerBoard}
          playCard={playCard}
          activeCardSlot={
            !gameState.playerTurn && gameState.activeCardDirection === "player"
              ? gameState.activeCardIdx
              : null
          }
          disabled={selectedCard == null}
        />
      </Row>

      <UIRow>
        <EndTurnButtonWrapper>
          <UnstyledButton onClick={ringBell} disabled={!gameState.playerTurn}>
            <EndTurnButton>
              <EndButtonIcon>
                <FontAwesomeIcon icon={faBellConcierge} />
              </EndButtonIcon>
              End Turn
            </EndTurnButton>
          </UnstyledButton>
        </EndTurnButtonWrapper>

        <DisplayHand
          cards={gameState.hand}
          selected={selectedCard}
          onSelect={onSelect}
        />

        <DisplayDrawPile
          drawCard={drawCard}
          disabled={!gameState.playerTurn || !gameState.canDrawCard}
          cards={gameState.drawPile}
        />
      </UIRow>

      <DeckWrapper>
        <DeckLabel>Deck:</DeckLabel>
        <DisplayCards cards={deck} />
      </DeckWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 30px;
  position: relative;
`;
const GameOverModal = styled.div`
  background: rgba(255, 255, 255, 0.9);
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-direction: column;
`;
const ScoreBoardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`;

const UIRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 25px 0;
`;
const EndTurnButtonWrapper = styled.div`
  flex-grow: 0;
  padding: 10px;
  justify-content: center;
`;

const EndTurnButton = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #999;
  border-radius: ${styleVars.buttonBorderRadius}px;
  padding: 5px 10px;
  background: #eee;
  font-size: 8px;
  line-height: 10px;
  font-weight: bold;
  text-transform: uppercase;
  &:hover {
    background: #ddd;
  }
`;
const EndButtonIcon = styled.div`
  font-size: 45px;
  text-align: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const RowLabel = styled.div`
  writing-mode: vertical-lr;
  transform: rotate(180deg);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  flex-grow: 0;
  color: #999;
  font-weight: bold;
  font-size: 0.8em;
`;

const DeckLabel = styled.div`
  border-top: 1px solid #999;
  margin-top: 100px;
  font-size: 24px;
  font-weight: bold;
  padding 10px;
`;
const DeckWrapper = styled.div`
  zoom: 60%;
`;

export default Game;
