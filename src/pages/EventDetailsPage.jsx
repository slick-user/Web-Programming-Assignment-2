import { Link, useParams } from 'react-router-dom';
import { useEvents } from '../api/useEvents.js';
import EventImage from '../components/EventImage.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { useCart } from '../context/CartContext.jsx';
import { allInPrice, calculatePricing } from '../rules/pricing.js';
import { availabilityLabel, formatDate, formatPKR } from '../utils/format.js';
import styles from './EventDetailsPage.module.css';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { events, loading, error, reload } = useEvents();
  const { items, dispatch } = useCart();

  if (loading) {
    return <p className={styles.message} role="status">Loading event…</p>;
  }

  if (error) {
    return (
      <div className={styles.message} role="alert">
        <p>We couldn't load this event. Please try again.</p>
        <button type="button" className={styles.retry} onClick={reload}>Retry</button>
      </div>
    );
  }

  const event = events.find((item) => item.id === id);

  // An unknown id is a normal case here, not an error: guide the user back to the list.
  if (!event) {
    return (
      <div className={styles.message}>
        <h1>We couldn't find that event</h1>
        <p>The link may be out of date, or the event may have been removed.</p>
        <Link to="/events">Browse all events</Link>
      </div>
    );
  }

  const soldOut = event.seatsRemaining === 0;
  const quantity = items.find((item) => item.id === event.id)?.quantity ?? 0;
  const price = calculatePricing(quantity, event.price);

  return (
    <div className={styles.page}>
      <Link className={styles.back} to="/events">← Back to events</Link>

      <article className={styles.card}>
        <EventImage event={event} className={styles.image} />

        <div className={styles.content}>
          <p className={styles.eyebrow}>{event.category} · {event.area}</p>
          <h1>{event.title}</h1>
          <p className={styles.description}>{event.description}</p>

          <dl className={styles.facts}>
            <div>
              <dt>When</dt>
              <dd>{formatDate(event.date)} at {event.time}</dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>{event.venue}, {event.area}</dd>
            </div>
            <div>
              <dt>Seats left</dt>
              <dd>{availabilityLabel(event.seatsRemaining)}</dd>
            </div>
            <div>
              <dt>Age</dt>
              <dd>{event.minAge >= 18 ? '18 and over' : 'All ages'}</dd>
            </div>
            {event.prerequisite && (
              <div>
                <dt>Prerequisite</dt>
                <dd>{event.prerequisite}</dd>
              </div>
            )}
            <div>
              <dt>All-in / ticket</dt>
              <dd>{formatPKR(allInPrice(event.price))}</dd>
            </div>
          </dl>

          <p className={styles.feeNote}>
            A Rs. 100 service fee is added per ticket. Groups of 4 or more get 10% off the ticket
            subtotal. The breakdown below updates as you change the quantity.
          </p>

          <section className={styles.choose} aria-labelledby="choose-heading">
            <h2 id="choose-heading" className={styles.chooseTitle}>Choose tickets</h2>

            {soldOut ? (
              <p className={styles.soldOut}>
                This event is sold out. <Link to="/events">Browse available events</Link>.
              </p>
            ) : (
              <>
                <p className={styles.quantityLabel} id="detail-quantity-label">Number of tickets</p>
                <QuantityStepper
                  event={event}
                  value={quantity}
                  onChange={(next) =>
                    dispatch({ type: 'set', id: event.id, quantity: next, max: event.seatsRemaining })
                  }
                  inputId="detail-quantity-label"
                />

                <dl className={styles.breakdown}>
                  <div>
                    <dt>Tickets ({price.ticketCount})</dt>
                    <dd>{formatPKR(price.subtotal)}</dd>
                  </div>
                  {price.discount > 0 && (
                    <div>
                      <dt>Group discount (10%)</dt>
                      <dd>− {formatPKR(price.discount)}</dd>
                    </div>
                  )}
                  <div>
                    <dt>Service fees</dt>
                    <dd>{formatPKR(price.serviceFees)}</dd>
                  </div>
                  <div className={styles.total}>
                    <dt>All-in total</dt>
                    <dd>{formatPKR(price.total)}</dd>
                  </div>
                </dl>

                <Link className={styles.primary} to="/checkout">
                  {quantity > 0 ? 'Continue to checkout' : 'Continue without tickets'}
                </Link>
              </>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
