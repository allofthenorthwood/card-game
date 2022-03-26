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
  cost: number; // TODO: right now this is only blood cost
  icon?: IconDefinition;
  sigils: Sigil[];
  drawable?: boolean;
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
  | "wolf"
  | "poisonFrog"
  | "hippo"
  | "cat"
  | "otter"
  | "fish"
  | "elk"
  | "squirrel"
  | "sparrow";

export const makePlayableCardFromId = (id: CardId) => {
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
    drawable: true,
  },
  dog: {
    name: "Watch Dog",
    attack: 2,
    health: 3,
    cost: 2,
    icon: faDog,
    sigils: ["Guardian"],
    drawable: true,
  },
  wolf: {
    name: "Wolf",
    attack: 3,
    health: 2,
    cost: 2,
    icon: faDog,
    sigils: [],
    drawable: true,
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
    drawable: true,
  },
  poisonFrog: {
    name: "Poison Frog",
    attack: 1,
    health: 1,
    cost: 2,
    icon: faFrog,
    sigils: ["Touch of Death", "Mighty Leap"],
    drawable: true,
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
    drawable: true,
  },
  sparrow: {
    name: "Sparrow",
    attack: 1,
    health: 2,
    cost: 1,
    icon: faDove,
    sigils: ["Airborne"],
    drawable: true,
  },
  otter: {
    name: "Otter",
    attack: 1,
    health: 1,
    cost: 1,
    icon: faOtter,
    sigils: [],
    drawable: true,
  },
  fish: {
    name: "Salmon",
    attack: 2,
    health: 2,
    cost: 1,
    icon: faFish,
    sigils: [],
    drawable: true,
  },
  elk: {
    name: "Elk",
    attack: 2,
    health: 4,
    cost: 2,
    icon: faHorse,
    sigils: [],
    drawable: true,
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

export const getDrawableCards = (): CardType[] => {
  const cards: CardType[] = [];
  Object.values(cardLibrary).forEach((card) => {
    if (card.drawable) {
      cards.push(card);
    }
  });
  return cards;
};

export default cardLibrary;
