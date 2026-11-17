export const MAX_PER_BOOKING = 6;

// Pure numeric rule shared by the stepper, the cart and the test suite.
export function checkCapacity(quantity, seatsRemaining) {
  const allowedMax = Math.max(0, Math.min(MAX_PER_BOOKING, seatsRemaining));

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      valid: false,
      reason: 'too_few',
      allowedMax,
      message: 'Choose at least 1 whole ticket.',
    };
  }

  if (seatsRemaining <= 0) {
    return {
      valid: false,
      reason: 'sold_out',
      allowedMax: 0,
      message: 'This event is sold out.',
    };
  }

  if (quantity > MAX_PER_BOOKING) {
    return {
      valid: false,
      reason: 'over_limit',
      allowedMax,
      message: `You can book at most ${MAX_PER_BOOKING} tickets per booking.`,
    };
  }

  if (quantity > seatsRemaining) {
    return {
      valid: false,
      reason: 'not_enough_seats',
      allowedMax,
      message: `Only ${seatsRemaining} seat${seatsRemaining === 1 ? '' : 's'} left — choose ${allowedMax} or fewer.`,
    };
  }

  return {
    valid: true,
    reason: null,
    allowedMax,
    message: `You can choose up to ${allowedMax} tickets.`,
  };
}
