export const SERVICE_FEE_PER_TICKET = 100;
export const GROUP_DISCOUNT_THRESHOLD = 4;
export const GROUP_DISCOUNT_RATE = 0.1;

// One source of truth for money: the listing price, details breakdown and checkout summary.
export function calculateSummary(lines) {
  const ticketCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const discount =
    ticketCount >= GROUP_DISCOUNT_THRESHOLD ? Math.round(subtotal * GROUP_DISCOUNT_RATE) : 0;
  const serviceFees = ticketCount * SERVICE_FEE_PER_TICKET;
  const total = subtotal - discount + serviceFees;

  return { ticketCount, subtotal, discount, serviceFees, total };
}

export function calculatePricing(quantity, pricePerTicket) {
  return calculateSummary([{ quantity, price: pricePerTicket }]);
}

// The price a card can show for a single ticket, fees included.
export function allInPrice(pricePerTicket) {
  return calculatePricing(1, pricePerTicket).total;
}
