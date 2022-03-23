import styled from "styled-components";
import { useImmerReducer } from "use-immer";
import { useEffect, useState } from "react";
import _ from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons";

import DisplayCards from "src/components/DisplayCards";
import DisplayHand from "src/components/DisplayHand";
import DisplayDrawPile from "src/components/DisplayDrawPile";
import DisplayBoardRow, {
  BoardRowType,
  BoardRowBooleanType,
  BoardIdxType,
} from "src/components/DisplayBoardRow";
import {
  makePlaybleCardFromId as makeCard,
  PlayableCardType,
  hasSigil,
  makePlayableCard,
  CardType,
} from "src/cardLibrary";
import ScoreBoard from "src/components/Scoreboard";
import UnstyledButton from "src/components/UnstyledButton";
import styleVars from "src/styleVars";
import { shuffle } from "src/random";

const SCORE_LIMIT = 5; // Difference in score that ends the game
const INITIAL_HAND_SIZE = 5; // Starting number of cards in your hand

const DEV = true;

type DirectionType = "player" | "opponent";

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
  sacrificingCardIdxs: BoardRowBooleanType;
  playerScore: number;
  opponentScore: number;
  selectedCardIdx: number | null;
  activeCardIdx: BoardIdxType | null;
  activeCardDirection: DirectionType;
  playerTurn: boolean;
  sacrificing: boolean;
  canDrawCard: boolean;
  gameOver: boolean;
  mustPlaceCard: boolean;
};

// TODO: make deck for real
const deck: Array<PlayableCardType> = [
  makeCard("poisonFrog"),
  makeCard("squirrel"),
  makeCard("squirrel"),
  makeCard("dog"),
  makeCard("frog"),
  makeCard("dragon"),
  makeCard("otter"),
  makeCard("sparrow"),
  makeCard("cat"),
  makeCard("fish"),
  makeCard("elk"),
  makeCard("squirrel"),
  makeCard("squirrel"),
  makeCard("squirrel"),
  makeCard("squirrel"),
];

// TODO: make opponent deck for real
const opponentDeck: Array<PlayableCardType> = [
  makeCard("frog"),
  makeCard("crow"),
  makeCard("frog"),
  makeCard("dragon"),
];

const makeInitialGameState = () => {
  const init: GameStateType = {
    hand: [],
    drawPile: shuffle(deck),
    opponentDeck: shuffle(opponentDeck),
    playerBoard: [null, null, null, null],
    opponentBoard: [null, null, null, null],
    opponentNextCards: [null, null, null, null],
    sacrificingCardIdxs: [false, false, false, false],
    playerScore: 0,
    opponentScore: 0,
    selectedCardIdx: null,
    activeCardIdx: null,
    activeCardDirection: "player",
    playerTurn: true,
    sacrificing: false,
    canDrawCard: true,
    gameOver: false,
    mustPlaceCard: false,
  };

  if (DEV) {
    (init.opponentNextCards = [
      makeCard("poisonFrog"),
      null,
      null,
      makeCard("dog"),
    ]),
      (init.opponentBoard = [null, makeCard("crow"), null, null]),
      (init.playerBoard = [makeCard("dragon"), null, null, null]);
  }

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
      type: "sacrifice_card";
      boardIdx: BoardIdxType;
    }
  | {
      type: "select_card";
      handIdx: number;
    }
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
      boardIdx: BoardIdxType;
    }
  | {
      type: "attack";
      idx: BoardIdxType;
      attacker: DirectionType;
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
  const placeCard = (
    idx: number,
    side: DirectionType,
    card: PlayableCardType
  ) => {
    const activeSide =
      side === "player" ? gameState.playerBoard : gameState.opponentBoard;
    const otherSide =
      side === "player" ? gameState.opponentBoard : gameState.playerBoard;

    activeSide[idx] = card;
    gameState.selectedCardIdx = null;

    if (otherSide[idx] == null) {
      // Check for Guardian cards
      for (let i = 0; i < otherSide.length; i++) {
        const c = otherSide[i];
        if (c && hasSigil(c, "Guardian")) {
          // Found a Guardian card, so move it to face the new card
          otherSide[i] = null;
          otherSide[idx] = c;
          break;
        }
      }
    }
  };

  const getSacrificeAmount = (card: PlayableCardType) => {
    // TODO: support goat 3 blood sigil; don't count non-sacrifice-able cards
    return 1;
  };

  const countPossibleSacrifices = () => {
    let sacrificeCount = 0;
    gameState.playerBoard.filter((card) => {
      if (card != null) {
        sacrificeCount += getSacrificeAmount(card);
      }
    });
    return sacrificeCount;
  };

  const countCurrentSacrifices = () => {
    let sacrificeCount = 0;
    gameState.sacrificingCardIdxs.forEach((sacrificed, idx) => {
      const card = gameState.playerBoard[idx];
      if (sacrificed && card != null) {
        sacrificeCount += getSacrificeAmount(card);
      }
    });
    return sacrificeCount;
  };

  const getSacrificeCost = (handIdx: number | null) => {
    const cardIdx = handIdx != null ? handIdx : gameState.selectedCardIdx;
    if (cardIdx != null) {
      if (gameState.hand[cardIdx] != null) {
        return gameState.hand[cardIdx]?.card.cost;
      }
    }
    return null;
  };

  const killCard = (idx: number, board: BoardRowType) => {
    const card = board[idx];
    if (!card) {
      return;
    }

    if (hasSigil(card, "Unkillable")) {
      // Put a fresh copy of this card into the player's hand
      const freshCard = makePlayableCard(card.originalCard);
      gameState.hand.push(freshCard);
    }
    board[idx] = null;
  };
  const clearSacrifices = (): BoardRowBooleanType => {
    return [false, false, false, false];
  };

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
    case "select_card": {
      if (gameState.mustPlaceCard) {
        return gameState;
      }
      if (action.handIdx === gameState.selectedCardIdx) {
        // deselect card
        gameState.selectedCardIdx = null;
        gameState.sacrificing = false;
        gameState.sacrificingCardIdxs = clearSacrifices();
        return gameState;
      }
      // check if there are enough cards that your sacrifice would work
      const cardCost = getSacrificeCost(action.handIdx);
      if (cardCost != null && countPossibleSacrifices() >= cardCost) {
        gameState.selectedCardIdx = action.handIdx;
        // If this card needs sacrificing, enter that state:
        if (cardCost > 0) {
          gameState.sacrificing = true;
        } else {
          gameState.sacrificing = false;
        }
      } else {
        // TODO: show error messages
        // "You don't have enough cards to sacrifices to afford this card"
      }

      return gameState;
    }
    case "sacrifice_card": {
      if (gameState.playerBoard[action.boardIdx] == null) {
        // no card to sacrifice
        return gameState;
      }

      if (gameState.sacrificingCardIdxs[action.boardIdx]) {
        // deselect card for sacrifice if they click it again
        gameState.sacrificingCardIdxs[action.boardIdx] = false;
      } else {
        gameState.sacrificingCardIdxs[action.boardIdx] = true;
      }
      const cardCost = getSacrificeCost(gameState.selectedCardIdx);
      if (cardCost && countCurrentSacrifices() >= cardCost) {
        gameState.sacrificingCardIdxs.forEach((cardSelected, idx) => {
          if (cardSelected) {
            // remove the card
            killCard(idx, gameState.playerBoard);
          }
        });
        // enter must-place-card state
        gameState.mustPlaceCard = true;

        // clear sacrifices
        gameState.sacrificingCardIdxs = clearSacrifices();
      }

      return gameState;
    }
    case "play_card": {
      const handIdx = action.handIdx;
      const boardIdx = action.boardIdx;
      const card = gameState.hand[handIdx];

      if (
        !gameState.mustPlaceCard &&
        card.card.cost > countCurrentSacrifices()
      ) {
        return gameState;
      }

      gameState.hand.splice(handIdx, 1);
      placeCard(boardIdx, "player", card);
      gameState.mustPlaceCard = false;
      gameState.sacrificing = false;
      gameState.sacrificingCardIdxs = clearSacrifices();

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
        let curCard = gameState.opponentBoard[idx];
        if (curCard == null) {
          let newCard = gameState.opponentNextCards[idx];
          if (newCard) {
            placeCard(idx, "opponent", newCard);
            gameState.opponentNextCards[idx] = null;
          }
        }
        attackerCards = gameState.opponentBoard;
        victimCards = gameState.playerBoard;
      }

      const attackerCard = attackerCards[idx];
      const victimCard = victimCards[idx];

      if (attackerCard) {
        const flying = hasSigil(attackerCard, "Airborne");
        const leap = victimCard && hasSigil(victimCard, "Mighty Leap");
        // flying cards attack opponent directly, but leap cards block flying
        if (victimCard && (!flying || leap)) {
          // TODO: overflow damage attacks cards in up next
          if (hasSigil(attackerCard, "Touch of Death")) {
            victimCard.card.health = 0;
          } else {
            victimCard.card.health -= attackerCard.card.attack;
          }

          // Remove victim cards with zero health
          if (victimCard.card.health <= 0) {
            killCard(idx, victimCards);
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

  const drawCard = () => {
    dispatch({ type: "draw_card" });
  };

  const playCard = (slot: BoardIdxType) => {
    if (gameState.selectedCardIdx != null) {
      dispatch({
        type: "play_card",
        handIdx: gameState.selectedCardIdx,
        boardIdx: slot,
      });
    }
  };
  const onSelect = (cardIdx: number) => {
    dispatch({
      type: "select_card",
      handIdx: cardIdx,
    });
  };

  const attack = async (
    attackerCards: BoardRowType,
    direction: DirectionType
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
  const sacrificeCard = (slot: BoardIdxType) => {
    dispatch({ type: "sacrifice_card", boardIdx: slot });
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
          disabled={gameState.selectedCardIdx == null}
          sacrificingCardIdxs={gameState.sacrificingCardIdxs}
          sacrificing={gameState.sacrificing}
          sacrificeCard={sacrificeCard}
        />
      </Row>

      <UIRow>
        <EndTurnButtonWrapper>
          <UnstyledButton
            onClick={ringBell}
            disabled={gameState.mustPlaceCard || !gameState.playerTurn}
          >
            <EndTurnButton
              disabled={gameState.mustPlaceCard || !gameState.playerTurn}
            >
              <EndButtonIcon>
                <FontAwesomeIcon icon={faBellConcierge} />
              </EndButtonIcon>
              End Turn
            </EndTurnButton>
          </UnstyledButton>
        </EndTurnButtonWrapper>

        <DisplayHand
          cards={gameState.hand}
          selected={gameState.selectedCardIdx}
          onSelect={onSelect}
        />

        <DisplayDrawPile
          drawCard={drawCard}
          disabled={
            gameState.mustPlaceCard ||
            !gameState.playerTurn ||
            !gameState.canDrawCard
          }
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

const EndTurnButton = styled.div<{ disabled: boolean }>`
  display: flex;
  flex-direction: column;
  border: 1px solid #999;
  border-radius: ${styleVars.buttonBorderRadius}px;
  padding: 5px 10px;
  background: #eee;
  ${(props) => (props.disabled ? "color: #999;" : "")}
  font-size: 8px;
  line-height: 10px;
  font-weight: bold;
  text-transform: uppercase;
  &:hover {
    ${(props) => (props.disabled ? "" : "background: #ddd;")}
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
