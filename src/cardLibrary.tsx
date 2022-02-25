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

type Sigil = "Airborne" | "Mighty Leap" | "Touch of Death" | "Unkillable";

export const hasSigil = (card: PlayableCardType, sigil: Sigil): boolean => {
  return card.card.sigils.includes(sigil);
};

export type CardType = {
  name: string;
  health: number;
  attack: number;
  icon?: IconDefinition;
  sigils: Sigil[];
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

type CardId = "frog" | "dog" | "dragon" | "crow" | "poisonFrog";

export const makePlaybleCardFromId = (id: CardId) => {
  return makePlayableCard(cardLibrary[id]);
};

const cardLibrary: { [id in CardId]: CardType } = {
  frog: {
    name: "Frog",
    attack: 1,
    health: 2,
    icon: faFrog,
    sigils: ["Mighty Leap"],
  },
  dog: {
    name: "Watch Dog",
    attack: 2,
    health: 3,
    icon: faDog,
    sigils: [],
  },
  dragon: {
    name: "Oroboros",
    attack: 2,
    health: 2,
    icon: faDragon,
    sigils: ["Unkillable"],
  },
  crow: {
    name: "Crow",
    attack: 2,
    health: 2,
    icon: faCrow,
    sigils: ["Airborne"],
  },
  poisonFrog: {
    name: "Poison Frog",
    attack: 1,
    health: 1,
    icon: faFrog,
    sigils: ["Touch of Death"],
  },
};

export default cardLibrary;
