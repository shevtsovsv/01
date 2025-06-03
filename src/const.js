const EVENT_COUNT = 25;

const FilterType = {
  EVERYTHING: "Everything",
  FUTURE: "future",
  PRESENT: "present",
  PAST: "past",
};

const SortType = {
  DATE: "date",
  TIME: "time",
  PRICE: "price",
};

const UserAction = {
  UPDATE_POINT: "UPDATE_POINT",
  ADD_POINT: "ADD_POINT",
  DELETE_POINT: "DELETE_POINT",
};

const UpdateType = {
  PATCH: "PATCH",
  MINOR: "MINOR",
  MAJOR: "MAJOR",
};

export { EVENT_COUNT, FilterType, SortType, UserAction, UpdateType };
