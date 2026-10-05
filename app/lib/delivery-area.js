export const DELIVERY_AREAS = ["Bole", "Kazanchis", "Piazza", "CMC"];

export function normalizeDeliveryArea(value) {
  return DELIVERY_AREAS.includes(value) ? value : "Bole";
}