export const WHEELERS = { "2": "Two wheeler", "3": "Three wheeler / Auto", "4": "Four wheeler", "heavy": "Heavy vehicle" };
export const SERVICES = {
  basic: { name: "Basic wash", price: { "2": 80, "3": 120, "4": 250, heavy: 600 } },
  foam: { name: "Foam wash", price: { "2": 130, "3": 180, "4": 400, heavy: 900 } },
  premium: { name: "Premium detail", price: { "2": 250, "3": 350, "4": 900, heavy: 1800 } },
};
export const SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
export const CAPACITY = 2; // vehicles per slot
export const priceFor = (service, wheeler) => SERVICES[service]?.price?.[wheeler] ?? 0;

