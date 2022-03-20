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
  faComputerMouse,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

type Sigil =
  | "Airborne"
  | "Mighty Leap"
  | "Touch of Death"
  | "Unkillable"
  | "Guardian";

export const hasSigil = (card: PlayableCardType, sigil: Sigil): boolean => {
  return card.card.sigils.includes(sigil);
};

export type CardType = {
  name: string;
  health: number;
  attack: number;
  cost: number;
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

type CardId =
  | "frog"
  | "dog"
  | "dragon"
  | "crow"
  | "poisonFrog"
  | "hippo"
  | "cat"
  | "otter"
  | "fish"
  | "elk"
  | "squirrel"
  | "sparrow";

export const makePlaybleCardFromId = (id: CardId) => {
  return makePlayableCard(cardLibrary[id]);
};

const cardLibrary: { [id in CardId]: CardType } = {
  frog: {
    name: "Frog",
    attack: 1,
    health: 2,
    cost: 1,
    icon: faFrog,
    sigils: ["Mighty Leap"],
  },
  dog: {
    name: "Watch Dog",
    attack: 2,
    health: 3,
    cost: 2,
    icon: faDog,
    sigils: ["Guardian"],
  },
  dragon: {
    name: "Oroboros",
    attack: 2,
    health: 2,
    cost: 2,
    icon: faDragon,
    sigils: ["Unkillable"],
  },
  crow: {
    name: "Crow",
    attack: 2,
    health: 2,
    cost: 2,
    icon: faCrow,
    sigils: ["Airborne"],
  },
  poisonFrog: {
    name: "Poison Frog",
    attack: 1,
    health: 1,
    cost: 2,
    icon: faFrog,
    sigils: ["Touch of Death", "Mighty Leap"],
  },
  hippo: {
    name: "Hippo",
    attack: 3,
    health: 6,
    cost: 3,
    icon: faHippo,
    sigils: [],
  },
  cat: {
    name: "Cat",
    attack: 0,
    health: 1,
    cost: 1,
    icon: faCat,
    sigils: [],
  },
  sparrow: {
    name: "Sparrow",
    attack: 1,
    health: 2,
    cost: 1,
    icon: faDove,
    sigils: ["Airborne"],
  },
  otter: {
    name: "Otter",
    attack: 1,
    health: 1,
    cost: 1,
    icon: faOtter,
    sigils: [],
  },
  fish: {
    name: "Salmon",
    attack: 2,
    health: 2,
    cost: 1,
    icon: faFish,
    sigils: [],
  },
  elk: {
    name: "Elk",
    attack: 2,
    health: 4,
    cost: 2,
    icon: faHorse,
    sigils: [],
  },
  squirrel: {
    name: "Squirrel",
    attack: 0,
    health: 1,
    cost: 0,
    icon: faComputerMouse,
    sigils: [],
  },
};

export default cardLibrary;
