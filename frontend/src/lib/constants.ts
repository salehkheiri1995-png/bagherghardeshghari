export const SERVICE_PRICES = {
  transport: Number(process.env.SERVICE_PRICE_TRANSPORT) || 50,
  accommodation: Number(process.env.SERVICE_PRICE_ACCOMMODATION) || 100,
  insurance: Number(process.env.SERVICE_PRICE_INSURANCE) || 30,
  visa: Number(process.env.SERVICE_PRICE_VISA) || 80,
} as const;

export const USD_TO_TOMAN = Number(process.env.USD_TO_TOMAN) || 60_000;
