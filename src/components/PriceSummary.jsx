import { formatPKR } from '../utils/format.js';
import styles from './PriceSummary.module.css';

export default function PriceSummary({ summary }) {
  const { ticketCount, subtotal, discount, serviceFees, total } = summary;

  return (
    <section className={styles.summary} aria-labelledby="summary-heading">
      <h2 id="summary-heading">Live summary</h2>

      <dl className={styles.rows}>
        <div>
          <dt>Tickets ({ticketCount})</dt>
          <dd>{formatPKR(subtotal)}</dd>
        </div>
        {discount > 0 && (
          <div>
            <dt>Group discount (10%)</dt>
            <dd>− {formatPKR(discount)}</dd>
          </div>
        )}
        <div>
          <dt>Service fees ({ticketCount} × Rs. 100)</dt>
          <dd>{formatPKR(serviceFees)}</dd>
        </div>
        <div className={styles.total}>
          <dt>Total (simulated)</dt>
          <dd>{formatPKR(total)}</dd>
        </div>
      </dl>

      <p className={styles.note}>
        {ticketCount >= 4
          ? 'Group discount applied: 10% off the ticket subtotal.'
          : 'Add a 4th ticket to get 10% off the ticket subtotal.'}
      </p>
      <p className={styles.simulated}>No real payment is taken. This is a simulated order.</p>
    </section>
  );
}
