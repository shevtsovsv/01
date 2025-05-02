const mockOffers = [
  {
    type: "taxi",
    offers: [
      {
        id: "f8bcdfcb-ccc1-465d-bc6e-5d7b9fdd32cc",
        title: "Upgrade to a business class",
        price: 171,
      },
      {
        id: "390f29cc-ddcb-403a-8e7b-2e58c90aae5a",
        title: "Choose the radio station",
        price: 33,
      },
      {
        id: "ee8b34c4-201a-4711-ad0d-aa0de8b92336",
        title: "Choose temperature",
        price: 79,
      },
      {
        id: "33b62165-82eb-484d-bb80-e10508aec046",
        title: "Drive quickly, I'm in a hurry",
        price: 65,
      },
      {
        id: "7833030a-cca5-4a0a-a2b2-1f27e86ea9cf",
        title: "Drive slowly",
        price: 183,
      },
    ],
  },
  {
    type: "bus",
    offers: [
      {
        id: "e2268d85-afd8-41d9-9f6d-183e0f2535c4",
        title: "Infotainment system",
        price: 76,
      },
      {
        id: "fa01441d-e6e9-4eff-90ed-90dd686fa6f1",
        title: "Order meal",
        price: 70,
      },
      {
        id: "6ffd43b0-bcfd-4952-a3b7-42bfdf106596",
        title: "Choose seats",
        price: 105,
      },
    ],
  },
  {
    type: "train",
    offers: [
      {
        id: "efe22e5a-e4e8-4fea-bfdd-4500b56d0b35",
        title: "Book a taxi at the arrival point",
        price: 83,
      },
      {
        id: "a647f8a6-7e2e-4590-a01f-b373926f007a",
        title: "Order a breakfast",
        price: 122,
      },
      {
        id: "94a079e3-0716-4606-a379-13651669d700",
        title: "Wake up at a certain time",
        price: 130,
      },
    ],
  },
  {
    type: "flight",
    offers: [
      {
        id: "79e71566-bf3b-471c-b2c8-4240ff60281d",
        title: "Choose meal",
        price: 92,
      },
      {
        id: "5cbf113d-4415-495a-b446-68bb1b6d66c6",
        title: "Choose seats",
        price: 32,
      },
      {
        id: "af99d60c-16ee-4a5f-a340-34c215b185d9",
        title: "Upgrade to comfort class",
        price: 197,
      },
      {
        id: "f1e13301-f2f3-44da-a97d-667d9345d05b",
        title: "Upgrade to business class",
        price: 69,
      },
      {
        id: "b50c6105-ce77-4ba6-954b-5f928e3085b9",
        title: "Add luggage",
        price: 193,
      },
      {
        id: "60883cb8-d12b-498c-8276-be34e8bab67e",
        title: "Business lounge",
        price: 99,
      },
    ],
  },
  {
    type: "check-in",
    offers: [
      {
        id: "ea5cb5bc-141b-43f3-a9ed-3396966e7a74",
        title: "Choose the time of check-in",
        price: 33,
      },
      {
        id: "d9b02afa-e7f5-4c68-92ef-e9c24214630f",
        title: "Choose the time of check-out",
        price: 102,
      },
      {
        id: "7181914e-2a59-463a-9cfd-0937aba391a2",
        title: "Add breakfast",
        price: 160,
      },
      {
        id: "b3cf4cc8-9d57-401c-819b-2f34bf5f8aa4",
        title: "Laundry",
        price: 53,
      },
      {
        id: "2517ff03-f770-4d53-90dc-7dcce54216b1",
        title: "Order a meal from the restaurant",
        price: 192,
      },
    ],
  },
  {
    type: "sightseeing",
    offers: [],
  },
  {
    type: "ship",
    offers: [
      {
        id: "117687a1-9c91-41ac-85ab-b8b967cda07b",
        title: "Choose meal",
        price: 111,
      },
      {
        id: "3e045213-0415-4353-9e98-b48ec08a46a2",
        title: "Choose seats",
        price: 190,
      },
      {
        id: "2e9df7fb-8fb7-48dc-961a-a5bd673a3cdc",
        title: "Upgrade to comfort class",
        price: 162,
      },
      {
        id: "8c889eff-949c-48fa-81f8-eb4f96426167",
        title: "Upgrade to business class",
        price: 61,
      },
      {
        id: "c0840035-152b-48ac-ab93-5501aafea745",
        title: "Add luggage",
        price: 164,
      },
      {
        id: "426a6140-8b54-411f-990c-89a55a36e901",
        title: "Business lounge",
        price: 146,
      },
    ],
  },
  {
    type: "drive",
    offers: [
      {
        id: "1ca1380b-e83f-4f0a-b57c-2bf48a5e202e",
        title: "With automatic transmission",
        price: 161,
      },
      {
        id: "853368ca-f785-4391-8543-60267315d41a",
        title: "With air conditioning",
        price: 177,
      },
    ],
  },
  {
    type: "restaurant",
    offers: [
      {
        id: "6ecd024c-65da-436a-8294-82a2c6478fe1",
        title: "Choose live music",
        price: 76,
      },
      {
        id: "37bee414-3937-47d5-9654-3bdaee612696",
        title: "Choose VIP area",
        price: 194,
      },
    ],
  },
];

function getOffers() {
  return mockOffers;
}

export { getOffers };
