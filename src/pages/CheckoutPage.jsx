import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../api/useEvents.js';
import { useCart } from '../context/CartContext.jsx';
import PriceSummary from '../components/PriceSummary.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { checkCapacity } from '../rules/capacity.js';
import { checkEligibilityForSelection } from '../rules/eligibility.js';
import { calculateSummary } from '../rules/pricing.js';
import { formatPKR } from '../utils/format.js';
import styles from './CheckoutPage.module.css';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form, selected) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'Enter your name.';
  if (!form.email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL_PATTERN.test(form.email.trim())) {
    errors.email = 'Enter a valid email address (for example, ayesha@example.com).';
  }

  const age = Number(form.age);
  if (form.age === '' || !Number.isFinite(age) || age <= 0) {
    errors.age = 'Enter your age as a number.';
  }

  if (selected.length === 0) errors.selection = 'Add at least one ticket before registering.';

  const eligibility = checkEligibilityForSelection(
    { age, prerequisiteConfirmed: form.prerequisiteConfirmed },
    selected,
  );
  if (!eligibility.valid) {
    if (eligibility.reason === 'under_age' || eligibility.reason === 'age_required') {
      errors.age = eligibility.message;
    }
    if (eligibility.reason === 'prerequisite_required') errors.prerequisite = eligibility.message;
  }

  for (const event of selected) {
    const capacity = checkCapacity(event.quantity, event.seatsRemaining);
    if (!capacity.valid) {
      errors.selection = `${event.title}: ${capacity.message}`;
      break;
    }
  }

  return errors;
}

export default function CheckoutPage() {
  const { events, loading, error, reload } = useEvents();
  const { items, dispatch } = useCart();
  const navigate = useNavigate();

  // Controlled form: values stay in state, so valid input is preserved after a failed submit.
  const [form, setForm] = useState({ name: '', email: '', age: '', prerequisiteConfirmed: false });
  const [errors, setErrors] = useState({});

  const selected = items
    .map((item) => {
      const event = events.find((candidate) => candidate.id === item.id);
      return event ? { ...event, quantity: item.quantity } : null;
    })
    .filter(Boolean);

  // The discount depends on the whole selection, not on each event separately.
  const summary = calculateSummary(
    selected.map(({ quantity, price }) => ({ quantity, price })),
  );
  const needsPrerequisite = selected.some((event) => event.prerequisite);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form, selected);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const reference = `TN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`;
    try {
      // Only the reference and totals are stored — no name, email or age.
      sessionStorage.setItem(
        'ticketnest.confirmation',
        JSON.stringify({ reference, ticketCount: summary.ticketCount, total: summary.total }),
      );
    } catch {
      // If storage is blocked, the confirmation page shows a helpful fallback.
    }

    dispatch({ type: 'clear' });
    navigate('/confirmation');
  }

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <h1>Complete your registration</h1>
        <p>Review your tickets, then fill in the details below. Everything here is simulated.</p>
      </header>

      {loading && <p role="status">Loading your selection…</p>}

      {error && (
        <div className={styles.error} role="alert">
          <p>We couldn't load your tickets. Please try again.</p>
          <button type="button" onClick={reload}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.layout}>
          <div className={styles.mainColumn}>
            <section className={styles.panel} aria-labelledby="selection-heading">
              <h2 id="selection-heading">Your tickets</h2>

              {selected.length === 0 ? (
                <div className={styles.empty} role="status">
                  <p>Your selection is empty.</p>
                  <Link to="/events">Browse events</Link>
                </div>
              ) : (
                <ul className={styles.ticketList}>
                  {selected.map((event) => (
                    <li key={event.id} className={styles.ticket}>
                      <div>
                        <h3>{event.title}</h3>
                        <p>{formatPKR(event.price)} per ticket · {event.area}</p>
                      </div>
                      <div className={styles.ticketControls}>
                        <QuantityStepper
                          event={event}
                          value={event.quantity}
                          onChange={(next) =>
                            dispatch({
                              type: 'set',
                              id: event.id,
                              quantity: next,
                              max: event.seatsRemaining,
                            })
                          }
                          inputId={`quantity-${event.id}`}
                        />
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={() => dispatch({ type: 'remove', id: event.id })}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {errors.selection && <p className={styles.errorText} role="alert">{errors.selection}</p>}
            </section>

            <form className={styles.panel} onSubmit={handleSubmit} noValidate>
              <h2 id="form-heading">Attendee details</h2>
              <p className={styles.hint}>Sample values: Ayesha Khan · ayesha@example.com · age 20.</p>

              <div className={styles.field}>
                <label htmlFor="attendee-name">Full name</label>
                <input
                  id="attendee-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && <p id="name-error" className={styles.errorText} role="alert">{errors.name}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="attendee-email">Email address</label>
                <input
                  id="attendee-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && <p id="email-error" className={styles.errorText} role="alert">{errors.email}</p>}
              </div>

              <div className={styles.field}>
                <label htmlFor="attendee-age">Age</label>
                <input
                  id="attendee-age"
                  name="age"
                  type="number"
                  min="1"
                  value={form.age}
                  onChange={(event) => updateField('age', event.target.value)}
                  aria-invalid={Boolean(errors.age)}
                  aria-describedby={errors.age ? 'age-error' : undefined}
                />
                {errors.age && <p id="age-error" className={styles.errorText} role="alert">{errors.age}</p>}
              </div>

              {needsPrerequisite && (
                <div className={styles.checkboxField}>
                  <label htmlFor="prerequisite-confirm">
                    <input
                      id="prerequisite-confirm"
                      type="checkbox"
                      checked={form.prerequisiteConfirmed}
                      onChange={(event) => updateField('prerequisiteConfirmed', event.target.checked)}
                      aria-invalid={Boolean(errors.prerequisite)}
                    />
                    I confirm I have completed the prerequisites listed on my selected events.
                  </label>
                  {errors.prerequisite && (
                    <p className={styles.errorText} role="alert">{errors.prerequisite}</p>
                  )}
                </div>
              )}

              <button type="submit" className={styles.submit}>Confirm simulated registration</button>
              <p className={styles.simulated}>No payment details are collected and no personal data is stored.</p>
            </form>
          </div>

          <aside className={styles.aside}>
            <PriceSummary summary={summary} />
          </aside>
        </div>
      )}
    </div>
  );
}
