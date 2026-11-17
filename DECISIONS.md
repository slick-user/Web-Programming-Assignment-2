# Decision record

TicketNest was built around three problems from the brief. Each entry below records the options,
the choice, the reasoning, and where the choice can be seen in the code.

## 1. Hidden fees — show the all-in price from the first screen

**Problem.** A base price on the listing followed by service fees and a group discount at checkout
makes the first price people see wrong. It also encourages adding tickets before realising the cost.

**Options considered**

1. Keep the base price on cards and explain fees in small print. *Rejected* — still hides the real cost.
2. Show "from Rs. X + fees" everywhere. *Rejected* — the reader still has to do the arithmetic.
3. Compute the final price once, in a pure function, and show that same number on cards, details and
   checkout. **Chosen.**

**Decision.** `calculateSummary(lines)` is the single source of truth for subtotal, 10% group
discount (4+ tickets), Rs. 100 fee per ticket and total. Cards call `allInPrice(price)`; details and
checkout call the same function with the chosen quantity. The discount is calculated over the whole
selection, not per event.

**Why.** One calculation means the three screens can never disagree. It is also easy to explain in a
viva: one function, one rule, three call sites.

**Trade-off.** A card can only show the single-ticket all-in price and an indicative group price;
the exact group total depends on what is in the cart, so it is shown live on the details and checkout
pages instead.

**Where.** `src/rules/pricing.js`, `src/components/EventCard.jsx`, `src/pages/EventDetailsPage.jsx`,
`src/pages/CheckoutPage.jsx`, `src/components/PriceSummary.jsx`.

**Verify.** `/events` shows *Rs. 2,600 all-in / ticket* and *Rs. 2,350 each for 4+ tickets* for UX
Sketching Basics. Adding 4 tickets gives `10,000 − 1,000 + 400 = Rs. 9,400` on both details and
checkout.

## 2. Lost filters and dead-end searches — keep view state in the URL

**Problem.** Search/filter/sort held only in component state disappear after a refresh, Back/Forward
does not restore the previous view, and a search with no matches leaves the user with no obvious way
out.

**Options considered**

1. `useState` only. *Rejected* — lost on refresh and invisible to the browser history.
2. Put filters in a global context. *Rejected* — still lost on refresh; adds machinery without
   fixing the actual problem.
3. Treat the query string as the state store. **Chosen.**

**Decision.** The listing page reads `q`, `category`, `available` and `sort` with
`useSearchParams`. Every control change writes a new query string as a new history entry, so Back and
Forward step through filter changes. "Clear filters" removes all parameters. An empty result shows a
specific message and a Clear button rather than a blank grid.

**Why.** The URL is already shareable, refresh-safe and history-aware. Using it avoids duplicating
state and makes the behaviour testable by simply opening an address.

**Trade-off.** Every keystroke in the search box adds a history entry. That is deliberate here so
Back/Forward demonstrably works, though a debounce would be preferable on a large production site.

**Where.** `src/pages/EventsPage.jsx`, `src/main.jsx` (`BrowserRouter`), `src/App.jsx`.

**Verify.** Open
`/events?q=workshop&category=Workshop&sort=price-asc&available=1` directly, refresh it, then use
Back/Forward. Open `/events?q=zzzznotfound` to see the no-match panel and its Clear filters button.

## 3. Unclear availability and limits — make constraints visible and enforced

**Problem.** Without visible seat counts or a booking limit, people can choose tickets that do not
exist, or discover a limit only when the form fails. A saved cart can also become invalid when
availability changes.

**Options considered**

1. Disable checkout silently when a selection is invalid. *Rejected* — gives no explanation.
2. Validate only on submit. *Rejected* — too late; the user has already filled the form.
3. Show the numbers next to every control, enforce them in a pure rule, and explain conflicts with
   one-click fixes. **Chosen.**

**Decision.** `checkCapacity(quantity, seatsRemaining)` returns `allowedMax = min(6, seatsRemaining)`
plus a specific reason and message. Cards show seats-left badges, the stepper prints the live limit
and disables `+` at the real maximum, and the reducer clamps quantities using the same rule. The
checkout page compares a restored cart with current availability and offers **Reduce to N** or
**Remove** for each conflict.

**Why.** The same rule drives badge, control, reducer, form validation and tests, so "visible" and
"enforced" cannot drift apart. The conflict panel turns a confusing failure into a recoverable step.

**Trade-off.** Capacity is only checked at load and on each change; there is no server reservation,
so two tabs can both show the same last seat. This is acceptable for a simulated site with no backend.

**Where.** `src/rules/capacity.js`, `src/components/QuantityStepper.jsx`,
`src/context/CartContext.jsx`, `src/components/EventCard.jsx`, `src/pages/CheckoutPage.jsx`,
`tests/ticketLimit.test.js`.

**Verify.** `bun test tests/ticketLimit.test.js` covers 0, 3, 6 and 7 tickets plus sold-out and
low-seat cases. In the UI, Margalla Sunrise Hike has 1 seat, Startup Pitch Night is sold out, and
the demo control "Only 2 seats on every event" demonstrates the restored-selection warning.

## Cross-cutting choice: everything is simulated

No payment gateway, credentials, accounts or email are involved. The cart in `localStorage` stores
only `{ id, quantity }`; the confirmation in `sessionStorage` stores only a reference, ticket count
and total. The registration form's name, email and age stay in React state and are discarded when the
cart is cleared. Demo switches also live in `sessionStorage`. This keeps the assignment safe to demo
and easy to reset.
