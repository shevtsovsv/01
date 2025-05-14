import { FilterType } from "../const";
import {
  isPointEverything,
  isPointFuture,
  isPointPresent,
  isPointPast,
} from "./task";

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter(isPointEverything),
  [FilterType.FUTURE]: (points) => points.filter(isPointFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPointPresent),
  [FilterType.PAST]: (points) => points.filter(isPointPast),
};

export { filter };
