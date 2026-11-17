export function formatDate(isoDate) {
  // Parse as local midnight so the displayed day never shifts by a timezone.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function availabilityLabel(seats) {
  if (seats === 0) return 'Sold out';
  if (seats <= 3) return `Only ${seats} seat${seats === 1 ? '' : 's'} left`;
  return `${seats} seats available`;
}

export function formatPKR(amount) {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
