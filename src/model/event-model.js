import { getRandomEvent } from "../mock/event.js";

const EVENT_COUNT = 3;

export default class EventModel {
  events = Array.from({ length: EVENT_COUNT }, getRandomEvent);

  getEvent() {
    return this.events;
  }
}
