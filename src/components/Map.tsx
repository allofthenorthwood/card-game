import Game from "./Game";
import { RawCard } from "./Card";
import { useState } from "react";
import {
  makePlayableCardFromId,
  makePlayableCard,
  PlayableCardType,
} from "src/cardLibrary";
import styled from "styled-components";
import _ from "lodash";
import { getDrawableCards, CardType } from "../cardLibrary";
import { shuffle } from "src/random";

// TODO: make deck for real
const deckInit: Array<PlayableCardType> = [
  makePlayableCardFromId("poisonFrog"),
  makePlayableCardFromId("squirrel"),
  makePlayableCardFromId("squirrel"),
  makePlayableCardFromId("dog"),
  makePlayableCardFromId("frog"),
];

// TODO: make opponent deck for real
// TODO: opponent deck should not be shuffled, the cards should appear in order
// TODO: opponent deck can contain "blanks" or multiple cards at a time that come in at once
// TODO: opponent cards can appear based on criteria like "this other card died"
const opponentDeckInit: Array<PlayableCardType> = [
  makePlayableCardFromId("frog"),
  makePlayableCardFromId("crow"),
  makePlayableCardFromId("frog"),
  makePlayableCardFromId("dragon"),
];

const locations = [
  {
    type: "draw_card",
  },
  {
    type: "battle",
    // TODO: put opponent deck here?
  },
];

const DrawCardScreen = ({
  onSelectCard,
}: {
  onSelectCard: (card: CardType) => void;
}) => {
  const cards = shuffle(getDrawableCards());
  return (
    <DrawableCards>
      {_.range(0, 3).map((idx) => {
        const card = cards[idx];
        return (
          <CardWrapper key={card.name + idx} onClick={() => onSelectCard(card)}>
            <RawCard card={card} />
          </CardWrapper>
        );
      })}
    </DrawableCards>
  );
};

const Map = () => {
  const [deck, setDeck] = useState(deckInit);
  const [opponentDeck, setopponentDeck] = useState(opponentDeckInit);
  const [location, setLocation] = useState(0);

  const nextLocation = () => {
    // TODO: if there's no next location, go to end state
    setLocation(location + 1);
    // TODO: make a new opponent deck for each battle, rising in difficulty
    setopponentDeck(opponentDeckInit);
  };
  const loseGame = () => {};
  const winGame = (excess: number) => {
    // TODO: gain points for your excess damage
    // TODO: select a card to add to your deck
    // then go to the next battle
    nextLocation();
  };
  const onSelectCard = (card: CardType) => {
    // todo: change this to
    const newDeck = _.cloneDeep(deck);
    newDeck.push(makePlayableCard(card));
    console.log(newDeck);
    setDeck(newDeck);
    nextLocation();
  };
  return (
    <Wrapper>
      <UI>Location #{location}</UI>
      {locations[location].type === "battle" ? (
        <Game
          deck={shuffle(deck)}
          opponentDeck={shuffle(opponentDeck)}
          loseGame={loseGame}
          winGame={winGame}
        />
      ) : (
        <DrawCardScreen onSelectCard={onSelectCard} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const UI = styled.div``;
const DrawableCards = styled.div`
  display: flex;
`;
const CardWrapper = styled.div`
  padding: 10px;
`;
export default Map;
