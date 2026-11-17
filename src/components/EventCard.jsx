import { Link } from 'react-router-dom';
import EventImage from './EventImage.jsx';
import { availabilityLabel, formatDate, formatPKR } from '../utils/format.js';
import styles from './EventCard.module.css';

export default function EventCard({ event }) {
  const soldOut = event.seatsRemaining === 0;
  const low = !soldOut && event.seatsRemaining <= 3;

  return (
    <article className={styles.card}>
      <EventImage event={event} className={styles.image} />

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.category}>{event.category}</span>
          <span
            className={`${styles.seats} ${soldOut ? styles.seatsNone : low ? styles.seatsLow : styles.seatsMany}`}
          >
            {availabilityLabel(event.seatsRemaining)}
          </span>
        </div>

        <h2 className={styles.title}>
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h2>

        <p className={styles.meta}>
          {formatDate(event.date)} · {event.time} · {event.venue}, {event.area}
        </p>
        <p className={styles.subMeta}>
          {event.minAge >= 18 ? '18+' : 'All ages'}
          {event.prerequisite ? ' · Prior session required' : ''}
        </p>

        <div className={styles.bottomRow}>
          <p className={styles.price}>
            <strong>{formatPKR(event.price)}</strong> <span>before fees</span>
          </p>
          <Link className={styles.details} to={`/events/${event.id}`}>
            Details <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
