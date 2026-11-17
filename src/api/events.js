import { events } from '../data/events.js';

// A short delay makes the loading state visible so the demo failure control is meaningful.
const DELAY_MS = 350;

// Demo scenarios change the data the mock API returns, without touching the source records.
function seatsFor(event, scenario) {
  if (scenario === 'sold_out' && event.id === 'data-visualisation-bootcamp') return 0;
  if (scenario === 'low_seats') return event.seatsRemaining === 0 ? 0 : Math.min(event.seatsRemaining, 2);
  return event.seatsRemaining;
}

export async function loadEvents({ failLoad = false, seatScenario = 'normal' } = {}) {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  if (failLoad) throw new Error('Simulated loading failure (demo control).');

  // Return copies so page code cannot mutate the source records.
  return events.map((event) => ({ ...event, seatsRemaining: seatsFor(event, seatScenario) }));
}
