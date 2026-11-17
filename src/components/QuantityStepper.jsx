import { checkCapacity } from '../rules/capacity.js';
import styles from './QuantityStepper.module.css';

// The limit is shown beside the control and the + button stops at the real maximum.
export default function QuantityStepper({ event, value, onChange, inputId }) {
  const { allowedMax } = checkCapacity(value || 1, event.seatsRemaining);
  const atMax = value >= allowedMax;

  return (
    <div className={styles.wrap}>
      <div className={styles.control}>
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= 1}
          aria-label={`Remove one ticket for ${event.title}`}
        >
          −
        </button>
        <output id={inputId} aria-live="polite">{value}</output>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={atMax}
          aria-label={`Add one ticket for ${event.title}`}
        >
          +
        </button>
      </div>

      <p className={styles.limit}>
        {allowedMax === 0
          ? 'Sold out — no tickets can be added.'
          : `Limit: ${allowedMax} ticket${allowedMax === 1 ? '' : 's'} per booking (${event.seatsRemaining} seats left).`}
        {atMax && allowedMax > 0 ? ' Maximum reached.' : ''}
      </p>
    </div>
  );
}
