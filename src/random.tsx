import seedrandom from "seedrandom";
import _ from "lodash";

const SEED_STRING = "this is the seed string";
const random = seedrandom(SEED_STRING);

export function shuffle<Type>(array: Type[]): Type[] {
  let arr = _.cloneDeep(array);
  let m = arr.length;
  let t = null;
  let i = null;
  while (m) {
    i = Math.floor(random() * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

export default random;
