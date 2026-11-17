import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format.js';
import styles from './ConfirmationPage.module.css';

function readConfirmation() {
  try {
    return JSON.parse(sessionStorage.getItem('ticketnest.confirmation') || 'null');
  } catch {
    return null;
  }
}

export default function ConfirmationPage() {
  // Read once: refreshing keeps the same simulated reference visible.
  const [confirmation] = useState(readConfirmation);

  return (
    <div className={styles.page}>
      {confirmation ? (
        <>
          <p className={styles.check} aria-hidden="true">✓</p>
          <h1>Registration complete</h1>
          <p className={styles.lead}>Your simulated booking is confirmed. No payment was taken.</p>

          <dl className={styles.details}>
            <div>
              <dt>Simulated booking reference</dt>
              <dd className={styles.reference}>{confirmation.reference}</dd>
            </div>
            <div>
              <dt>Tickets</dt>
              <dd>{confirmation.ticketCount}</dd>
            </div>
            <div>
              <dt>Simulated total</dt>
              <dd>{formatPKR(confirmation.total)}</dd>
            </div>
          </dl>

          <p className={styles.note}>
            This reference is fictional and is not a real ticket. No personal data from the form was
            saved.
          </p>
        </>
      ) : (
        <>
          <h1>No recent confirmation</h1>
          <p className={styles.lead}>Register for an event to see your simulated booking reference here.</p>
        </>
      )}

      <div className={styles.actions}>
        <Link className={styles.primary} to="/events">Browse more events</Link>
        <Link className={styles.secondary} to="/">Back to home</Link>
      </div>
    </div>
  );
}
