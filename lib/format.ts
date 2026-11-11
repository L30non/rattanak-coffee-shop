const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Display formatting for prices and totals: "$3,680.00". Translation params
 * and payment amounts keep raw `toFixed(2)`.
 */
export function formatPrice(amount: number): string {
  return usd.format(amount);
}
