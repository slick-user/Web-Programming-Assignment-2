# TicketNest

A simulated ticketing and registration site for small events in Islamabad (workshops, talks and
weekend activities). Students and young professionals can find an event, choose tickets, register,
and receive a confirmation. **Every order is simulated — no real payment is taken and no personal
data is stored.**

> Status: Complete — Milestone 5 of 5. The decision record is in [`DECISIONS.md`](DECISIONS.md).

**Student:** Azlan Ali Khan  
**Roll number:** 24I-2110  
**GitHub:** https://github.com/slick-user/Web-Programming-Assignment-2  
**Deployment:** https://web-programming-assignment-2-beta.vercel.app

## Install and run

Requires Node.js 18+ (or Bun) and a package manager.

```bash
# install
npm install          # or: bun install

# development server
npm run dev

# production build
npm run build

# preview the production build
npm run preview

# tests
npm test             # runs: node --test
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home / landing page |
| `/events` | Listing with search, filter and sort kept in the URL |
| `/events/:id` | Event details, quantity selection and live price breakdown |
| `/checkout` | Selection review, registration form and live summary |
| `/confirmation` | Simulated booking confirmation |
| `*` | Friendly not-found page |

All routes are handled by `BrowserRouter`. Direct loads, refresh, and Back/Forward work because the
host is configured to rewrite unknown paths to `index.html` (see [Deployment](#deployment)).

## Features

- All-in pricing (ticket + service fee, with a 10% group discount for 4+) shown from the first screen.
- Search, category filter, "available only" filter and sort kept in the URL query string.
- Text seats-left badges, visible ticket limits beside quantity controls, and a restored-selection warning.
- Shared cart in React Context with `useReducer`, restored from `localStorage` as `{ id, quantity }` only.
- Controlled registration form with specific validation messages that preserves valid input on error.
- Age (18+) and prerequisite rules shared between the UI and pure rule modules.
- Visible demo controls to force a loading failure and change seat availability.
- Simulated confirmation with a reference; no personal data is written to storage.

## Milestone history

| Milestone | Commit | Delivered |
| --- | --- | --- |
| 1 | `71b8e74` | Vite + React JavaScript scaffold, 12 varied event records, CSS tokens, README skeleton |
| 2 | `4bcb7b7` | Routes, shared layout, home, URL-backed listing, details and not-found pages |
| 3 | `0e1a0e7` | Cart Context + reducer, quantity steppers, form and validation, live summary, capacity tests |
| 4 | `44bd467` | All-in pricing first, demo controls, restored-selection conflict fixes |
| 5 | this milestone | Documentation, decision record, concept map, deployment config |

## Concept map

| Concept | File | Component / function |
| --- | --- | --- |
| Routing and nested layout | `src/main.jsx`, `src/App.jsx` | `BrowserRouter`, `Routes`, `Layout` / `Outlet` |
| URL as state | `src/pages/EventsPage.jsx` | `useSearchParams`, `updateParam`, `clearFilters` |
| Component composition | `src/components/EventCard.jsx` | `EventCard` (image, badges, price, quick-add) |
| Reusable fallback UI | `src/components/EventImage.jsx`, `src/components/Notice.jsx` | `onError` image swap, `Notice` |
| Effects and cleanup | `src/api/useEvents.js` | `useEvents` with an `ignore` flag, `attempt`/`reload` |
| Async mock API | `src/api/events.js` | `loadEvents({ failLoad, seatScenario })` |
| Context + reducer | `src/context/CartContext.jsx` | `CartProvider`, `reducer`, `useCart` |
| Demo-only context | `src/context/DemoContext.jsx` | `DemoProvider`, `useDemo` |
| Pure business rules | `src/rules/*.js` | `checkCapacity`, `checkEligibility`, `calculateSummary` |
| Controlled form and validation | `src/pages/CheckoutPage.jsx` | `form` state, `validate`, `handleSubmit` |
| Derived data / no mutation | `src/pages/EventsPage.jsx`, `src/rules/pricing.js` | `filter()` then `sort()` copies, `calculateSummary` |
| Live feedback | `src/components/PriceSummary.jsx`, `QuantityStepper.jsx` | `aria-live`, disabled buttons at real limits |
| Browser storage | `src/context/CartContext.jsx`, `DemoContext.jsx`, `src/pages/ConfirmationPage.jsx` | `localStorage`, `sessionStorage` |
| CSS Modules and design tokens | `src/components/*.module.css`, `src/styles/global.css` | Scoped classes, colour/spacing variables |
| Responsive layout | `EventsPage.module.css`, `CheckoutPage.module.css` | `auto-fill` grid, stacked → two-column media query |
| Accessibility basics | `CheckoutPage.jsx`, `QuantityStepper.jsx` | Labels, `aria-invalid`, `role="alert"`, labelled buttons |
| Unit testing | `tests/ticketLimit.test.js` | `node:test`, `node:assert/strict` |

## Edge cases and how to reproduce them

| Case | Steps | Expected result |
| --- | --- | --- |
| No search matches | Open `/events?q=zzzznotfound` | "No events match your filters" plus a **Clear filters** button |
| Filters survive refresh/history | Open `/events?q=workshop&category=Workshop&sort=price-asc&available=1`, refresh, press Back | Controls restored each time; URL changes with every control |
| Invalid event id | Open `/events/no-such-event` | Helpful "We couldn't find that event" with a link to the list |
| Unknown route | Open `/no-such-page` | Not-found page with links home and to events |
| Sold out | Open Startup Pitch Night or Personal Finance for New Graduates | Sold-out badge, no quantity control, "Browse available events" |
| Last seat | Open Margalla Sunrise Hike | Badge "Only 1 seat left", limit text says 1, `+` disabled after one |
| Booking limit | Add 6 tickets to UX Sketching Basics | `+` disables at 6 and "Maximum reached" appears |
| Group discount | Add 4 tickets to UX Sketching Basics | `10,000 − 1,000 + 400 = Rs. 9,400` on details and checkout |
| Under-age rule | Add Margalla Sunrise Hike (18+), enter age 17 | Form error: "You must be 18 or older…" |
| Age boundary | Same event, enter age 18 | Age accepted |
| Prerequisite | Add Advanced React Patterns, submit without the checkbox | "Please confirm you have completed…" |
| Valid input preserved | Submit empty, then fill name/email/age but leave the checkbox off | Only the prerequisite error remains; the filled values stay |
| Missing image | Open Public Speaking Clinic | Shared placeholder image is shown |
| Long title | Open the Student Film, Music and Maker Festival | Title wraps inside the card and details heading |
| Loading failure | Open Demo controls → check "Force event loading to fail" | Error panel with **Retry** on listing and details |
| Retry recovery | Uncheck the failure switch | Events load again without refreshing |
| Changed availability | Save 3 tickets, then choose "Only 2 seats on every event" | Details warns the saved quantity is over the limit; checkout shows a conflict panel with **Reduce to 2** / **Remove** |
| Confirmation refresh | Complete a simulated registration, refresh `/confirmation` | Same reference and total remain visible |

## Demo controls

The collapsible **Demo controls** panel sits just below the header on every page. Its switches live
in `sessionStorage` and feed directly into the mock API, so they are safe to use in a viva:

- **Force event loading to fail** — demonstrates the loading error and Retry state. Turn it off to recover.
- **Availability scenario** — `Normal`, `Data Visualisation Bootcamp sold out`, or `Only 2 seats on
  every event`. Change it while tickets are in the cart to demonstrate the restored-selection warning.
- **Reset demo controls** — returns both switches to normal.

## Simulated operations and known limitations

- No payment is collected, no email is sent, and there are no accounts or credentials.
- The form's name, email and age stay in component state only. Nothing but the cart ids/quantities,
  demo switches, and the confirmation reference/total/count is written to browser storage.
- Event data is local and fictional. Availability changes are scenario switches, not real reservations;
  two tabs could both show the same last seat.
- The booking reference is generated in the browser. It is not a real ticket and is not validated by a server.
- There is no backend, so clearing site data resets the cart and demo switches.
- Search adds a history entry per keystroke so Back/Forward is easy to demonstrate; a debounce would be
  added in a production app.

## Testing

```bash
npm test                            # Node 18+ runs: node --test
bun test tests/ticketLimit.test.js  # use this in the Bun-based development container
```

`tests/ticketLimit.test.js` uses `node:test` and `node:assert/strict` to cover ordinary quantities,
exactly 6, 7 (over limit), more than seats remaining, sold out, fewer than one, and a low-seat
scenario. The app imports the same `checkCapacity` function, so the tests exercise the real rule.

> In the development container `node` is symlinked to Bun, where `node --test` reports that tests must
> be run with `bun test`. The package script is kept as `node --test` for a standard Node environment.

## Deployment

Build with `npm run build`; the output is the static `dist/` folder. Because this is a single-page app,
the host must serve `index.html` for unknown paths so direct links such as `/events/ux-sketching-basics`
work. Both common cases are included:

- `vercel.json` — rewrites all paths to `/index.html` for Vercel.
- `public/_redirects` — `/* /index.html 200` for Netlify (copied into `dist/` by the build).

Deploy `dist/` (or connect the repository to the host). After deployment, open a deep link directly and
press refresh to confirm the rewrite is active. Fill in the student, GitHub and deployment fields at
the top of this README before submission.
