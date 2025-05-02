import { getRandomArrayElement } from "../utils.js";
import { TYPE } from "../const.js";

const mockEvents = [
  {
    type: 9,
    city: "Amsterdam",
    dateStart: new Date("2025-03-18T10:30:00"), // дата + время начала
    dateEnd: new Date("2025-03-18T11:00:00"), // дата + время конца
    price: 20,
    offers: [
      {
        name: "Order Uber",
        prise: 20,
        isSelected: true,
      },
      {
        name: "Add luggage",
        prise: 50,
        isSelected: false,
      },
    ],
    favorite: true,
    destination: {
      text: "Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.",
      imgs: ["1.jpg", "2.jpg", "3.jpg", "4.jpg"],
    },
  },
  {
    type: 5,
    city: "Chamonix",
    dateStart: new Date("2025-03-18T12:25:00"), // дата + время начала
    dateEnd: new Date("2025-03-18T13:35:00"), // дата + время конца
    price: 160,
    offers: [
      {
        name: "Order Uber",
        prise: 20,
        selected: false,
      },
      {
        name: "Add luggage",
        prise: 50,
        selected: true,
      },
      {
        name: "Switch to comfort",
        prise: 80,
        selected: true,
      },
    ],
    favorite: false,
  },
  {
    type: 4,
    city: "Chamonix",
    dateStart: new Date("2025-03-18T14:30:00"), // дата + время начала
    dateEnd: new Date("2025-03-18T16:05:00"), // дата + время конца
    price: 160,
    offers: [
      {
        name: "Order Uber",
        prise: 20,
        selected: false,
      },
      {
        name: "Add luggage",
        prise: 50,
        selected: false,
      },
      {
        name: "Rent a car",
        prise: 200,
        selected: true,
      },
    ],
    favorite: true,
  },
  {
    type: 3,
    city: "Chamonix",
    dateStart: new Date("2025-03-18T16:20:00"), // дата + время начала
    dateEnd: new Date("2025-03-18T17:00:00"), // дата + время конца
    price: 600,
    offers: [
      {
        name: "Add breakfast",
        prise: 50,
        selected: true,
      },
      {
        name: "Add luggage",
        prise: 50,
        selected: false,
      },
    ],
    favorite: true,
  },
  {
    type: 8,
    city: "Chamonix",
    dateStart: new Date("2025-03-19T14:20:00"), // дата + время начала
    dateEnd: new Date("2025-03-19T15:00:00"), // дата + время конца
    price: 50,
    offers: [
      {
        name: "Book tickets",
        prise: 40,
        selected: true,
      },
      {
        name: "Lunch in city",
        prise: 30,
        selected: true,
      },
    ],
    favorite: true,
  },
  {
    type: 4,
    city: "Geneva",
    dateStart: new Date("2025-03-19T16:00:00"), // дата + время начала
    dateEnd: new Date("2025-03-19T17:00:00"), // дата + время конца
    price: 20,
    offers: [
      {
        name: "Order Uber",
        prise: 20,
        selected: false,
      },
      {
        name: "Add luggage",
        prise: 50,
        selected: false,
      },
      {
        name: "Rent a car",
        prise: 200,
        selected: false,
      },
    ],
    favorite: false,
  },
  {
    type: 5,
    city: "Geneva",
    dateStart: new Date("2025-03-18T18:00:00"), // дата + время начала
    dateEnd: new Date("2025-03-18T19:00:00"), // дата + время конца
    price: 20,
    offers: [
      {
        name: "Order Uber",
        prise: 20,
        selected: false,
      },
      {
        name: "Add luggage",
        prise: 30,
        selected: true,
      },
      {
        name: "Switch to comfort",
        prise: 100,
        selected: true,
      },
    ],
    favorite: false,
  },
];

function getRandomEvent() {
  return getRandomArrayElement(mockEvents);
}
function getType(id) {
  return TYPE[id];
}

export { getRandomEvent, getType };
