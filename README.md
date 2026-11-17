# TicketNest

A simulated ticketing and registration site for small events in Islamabad (workshops, talks and weekend activities). Students and young professionals can find an event, choose tickets, register, and receive a confirmation. **Every order is simulated — no real payment is taken and no personal data is stored.**

> Status: Milestone 3 of 5. This README is a skeleton; edge-case steps, the concept map and the decision record are completed in the final milestone.

**Student:** [Your Name]
**Roll number:** [Your Roll Number]
**GitHub:** [GitHub Link]
**Deployment:** [Deployment Link]

## Install and run

Requires Node.js (or Bun) and a package manager.

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

## Routes (planned)

| Route | Purpose |
| --- | --- |
| `/` | Home / landing page |
| `/events` | Listing with search, filter and sort |
| `/events/:id` | Event details and quantity selection |
| `/checkout` | Registration form and live summary |
| `/confirmation` | Simulated booking confirmation |
| `*` | Friendly not-found page |

## Feature summary (planned)

- All-in pricing (ticket + service fee, with group discount) shown from the first screen.
- Search, category filter, "available only" filter and sort kept in the URL.
- Seats-left badges with text, ticket limits beside quantity controls, hidden-selection warnings.
- Shared cart in React Context with `useReducer`, restored from local storage and re-checked.
- Controlled registration form with specific validation messages.
- Demo controls to force a loading failure and change an event's availability.

## Current milestone contents

- Vite + React (JavaScript) project setup with `"type": "module"`.
- Folder structure: `components`, `pages`, `data`, `api`, `rules`, `context`, `styles`, `tests`, `utils`.
- Authored CSS (CSS Modules) foundation and original colour/type tokens.
- `src/data/events.js` with 12 varied event records, including sold-out events, low-availability events, 18+ events, prerequisite events, a missing image and a very long title.
- Routes, shared header/footer layout, home page, and a details page with a helpful invalid-id message.
- Listing page with search, category filter, "available only" filter and sort, all stored in the URL query string.
- Async mock loader in `src/api/` with loading, error and Retry states.
- Shared cart in `src/context/CartContext.jsx`: Context + `useReducer`, persisted as `{ id, quantity }` only.
- Pure rules in `src/rules/`: `checkCapacity` (max 6 and seats remaining), `checkEligibility` (age and prerequisites) and `calculateSummary` (fees and group discount) shared by the UI and the tests.
- Quantity steppers on details and checkout that disable `+` at the real maximum; live price breakdown on both pages.
- Controlled registration form with specific validation messages and preserved valid input; simulated confirmation with a reference stored without personal data.
- `tests/ticketLimit.test.js` covering the ticket-limit rule with `node:test` and `node:assert/strict`.

## To be completed

- Edge-case reproduction steps and demo-control walkthrough.
- Simulated-operations notes and known limitations.
- Concept map table (concept → file → component/function).
- `DECISIONS.md` with one entry per problem.
