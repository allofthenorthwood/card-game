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
} from "@fortawesome/free-solid-svg-icons";

export type CardType = {
  name: string;
  health: number;
  attack: number;
  icon?: any; //todo
};

const cardLibrary: { [cardId: string]: CardType } = {
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
};

export default cardLibrary;
