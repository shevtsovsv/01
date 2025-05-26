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
  UPDATE_TASK: "UPDATE_TASK",
  ADD_TASK: "ADD_TASK",
  DELETE_TASK: "DELETE_TASK",
};

const UpdateType = {
  PATCH: "PATCH",
  MINOR: "MINOR",
  MAJOR: "MAJOR",
};

export { EVENT_COUNT, FilterType, SortType, UserAction, UpdateType };
