import { events } from '../data/events.js';

// A short delay makes the loading state visible. Later milestones add demo controls here.
const DELAY_MS = 350;

export async function loadEvents() {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  // Return copies so page code cannot mutate the source records.
  return events.map((event) => ({ ...event }));
}
