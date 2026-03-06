export const BASE_PRICE_PER_PERSON = 200;

export function calculateTotal(visitorCount: number): number {
  if (!visitorCount || visitorCount < 1) return 0;
  return visitorCount * BASE_PRICE_PER_PERSON;
}
