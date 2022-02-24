import {
  faFrog,
  faCat,
  faOtter,
  faDog,
  faCrow,
  faDove,
  faDragon,
  faHippo,
  faFish,
  faHorse,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

export type CardType = {
  name: string;
  health: number;
  attack: number;
  icon?: IconDefinition;
};

export type PlayableCardType = {
  originalCard: CardType;
  card: CardType;
  id: number;
};

let id = 0;
export const makePlayableCard = (card: CardType): PlayableCardType => {
  return {
    originalCard: _.cloneDeep(card),
    card: _.cloneDeep(card),
    id: id++,
  };
};

type cardId = "frog" | "dog" | "dragon";

export const makePlaybleCardFromId = (id: cardId) => {
  return makePlayableCard(cardLibrary[id]);
};

const cardLibrary: { [id in cardId]: CardType } = {
  frog: {
    name: "Frog",
    attack: 1,
    health: 2,
    icon: faFrog,
    // sigils: ["leap"]
  },
  dog: {
    name: "Watch Dog",
    attack: 2,
    health: 3,
    icon: faDog,
  },
  dragon: {
    name: "Oroboros",
    attack: 2,
    health: 2,
    icon: faDragon,
  },
};

export default cardLibrary;
