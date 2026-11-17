export const WHEELERS = {
  "2": "Two Wheeler / Bike",
  "3": "Three Wheeler / Auto",
  "4": "Normal Car (5 Seater)",
  "7": "Big Car (7 Seater / SUV)",
  "heavy": "Heavy Vehicle",
};

export const SERVICES = {
  // --- CAR & BIKE WASH PAYMENT ---
  bike_water: {
    name: "Bike Only Water Wash",
    category: "wash",
    price: { "2": 100, default: 100 },
  },
  bike_normal: {
    name: "Bike Normal Wash",
    category: "wash",
    price: { "2": 200, default: 200 },
  },
  bike_diesel: {
    name: "Bike Diesel Wash",
    category: "wash",
    price: { "2": 300, default: 300 },
  },
  car_water: {
    name: "Car Only Water Wash",
    category: "wash",
    price: { "4": 200, "7": 200, default: 200 },
  },
  car_outside: {
    name: "Car Only Out Side Wash",
    category: "wash",
    price: { "4": 300, "7": 400, default: 300 },
  },
  car_outside_big: {
    name: "Car Out Side Wash Big Vehicle",
    category: "wash",
    price: { "4": 400, "7": 400, default: 400 },
  },
  car_body_5s: {
    name: "Car Body Wash 5 Seater",
    category: "wash",
    price: { "4": 500, "7": 600, default: 500 },
  },
  car_body_diesel_5s: {
    name: "Car Body Wash Diesel Wash 5 Seater",
    category: "wash",
    price: { "4": 600, "7": 700, default: 600 },
  },
  car_body_7s: {
    name: "Car Body Wash 7 Seater",
    category: "wash",
    price: { "4": 600, "7": 600, default: 600 },
  },
  car_body_diesel_7s: {
    name: "Car Body Wash Diesel Wash 7 Seater",
    category: "wash",
    price: { "4": 700, "7": 700, default: 700 },
  },
  car_full_5s: {
    name: "Car Full Wash 5 Seater",
    category: "wash",
    price: { "4": 600, "7": 700, default: 600 },
  },
  car_full_diesel_5s: {
    name: "Car Full Wash Diesel Wash (5 Seater)",
    category: "wash",
    price: { "4": 700, "7": 800, default: 700 },
  },
  car_full_7s: {
    name: "Car Full Wash 7 Seater",
    category: "wash",
    price: { "4": 700, "7": 700, default: 700 },
  },
  car_full_diesel_7s: {
    name: "Car Full Diesel Wash 7 Seater",
    category: "wash",
    price: { "4": 800, "7": 800, default: 800 },
  },

  // --- CAR POLISH PAYMENT ---
  polish_normal: {
    name: "Normal Polish",
    category: "polish",
    price: { "4": 2500, "7": 3500, default: 2500 },
  },
  polish_interior: {
    name: "Interior Polish",
    category: "polish",
    price: { "4": 1500, "7": 2500, default: 1500 },
  },
  polish_teflon: {
    name: "Teflon Polish",
    category: "polish",
    price: { "4": 3500, "7": 5500, default: 3500 },
  },
  polish_ceramic: {
    name: "Ceramic Polish",
    category: "polish",
    price: { "4": 12500, "7": 17500, default: 12500 },
  },
  polish_glass_all: {
    name: "All Glass Polish",
    category: "polish",
    price: { "4": 2500, "7": 2500, default: 2500 },
  },
  polish_glass_front: {
    name: "Front Glass Polish",
    category: "polish",
    price: { "4": 1000, "7": 1000, default: 1000 },
  },
  polish_headlight: {
    name: "Head Light Polish",
    category: "polish",
    price: { "4": 600, "7": 600, default: 600 },
  },
  clean_roof: {
    name: "Roof Cleaning",
    category: "polish",
    price: { "4": 1000, "7": 1000, default: 1000 },
  },
  clean_seat: {
    name: "Seat Cleaning",
    category: "polish",
    price: { "4": 1000, "7": 1000, default: 1000 },
  },

  // --- COMPATIBILITY PACKAGES ---
  basic: {
    name: "Basic Water Wash",
    category: "wash",
    price: { "2": 100, "3": 150, "4": 200, "7": 200, heavy: 500, default: 200 },
  },
  foam: {
    name: "Car Full Wash & Foam",
    category: "wash",
    price: { "2": 200, "3": 350, "4": 600, "7": 700, heavy: 1000, default: 600 },
  },
  premium: {
    name: "Full Polish & Detailing",
    category: "polish",
    price: { "2": 800, "3": 1500, "4": 2500, "7": 3500, heavy: 5500, default: 2500 },
  },
};

export const SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const CAPACITY = 2; // vehicles per slot

export const priceFor = (service, wheeler) => {
  const s = SERVICES[service];
  if (!s) return 0;
  if (typeof s.price === "number") return s.price;
  if (s.price && typeof s.price === "object") {
    return s.price[wheeler] ?? s.price["4"] ?? s.price.default ?? 0;
  }
  return 0;
};
