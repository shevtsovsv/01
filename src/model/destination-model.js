import { getDestination } from "../mock/destination.js";

export default class DestinationModel {
  destinations = getDestination();

  getDestinationById(id) {
    const destination = this.destinations.find((item) => item.id === id);
    return destination ? destination : [];
  }
}

// const dest = new DestinationModel();
