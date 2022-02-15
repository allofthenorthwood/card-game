import styled from "styled-components";
import { useImmerReducer } from "use-immer";
import { useState } from "react";
import _ from "lodash";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBellConcierge } from "@fortawesome/free-solid-svg-icons";

import DisplayCards from "src/components/DisplayCards";
import DisplayHand from "src/components/DisplayHand";
import DisplayDrawPile from "src/components/DisplayDrawPile";
import DisplayBoardRow, { BoardRowType } from "src/components/DisplayBoardRow";
import cardLibrary, { CardType } from "src/cardLibrary";
import ScoreBoard from "src/components/Scoreboard";
import UnstyledButton from "src/components/UnstyledButton";
import styleVars from "src/styleVars";

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

  // TODO: handle max score diff (i.e. > 5) and pass max through to scoreboard
  return (
    <Container>
      <ScoreBoardContainer>
        <ScoreBoard
          playerScore={gameState.playerScore}
          opponentScore={gameState.opponentScore}
        />
      </ScoreBoardContainer>
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

        <HandWrapper>
          <DisplayHand
            cards={gameState.hand}
            selected={selectedCard}
            onSelect={onSelect}
          />
        </HandWrapper>

        <DisplayDrawPile
          drawCard={drawCard}
          disabled={!gameState.playerTurn}
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
`;
const ScoreBoardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`;

const UIRow = styled.div`
  display: flex;
  justify-content: stretch;
`;
const EndTurnButtonWrapper = styled.div`
  flex-grow: 0;
  display: flex;
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

const HandWrapper = styled.div`
  flex-grow: 1;
`;

const Row = styled.div`
  display: flex;
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
