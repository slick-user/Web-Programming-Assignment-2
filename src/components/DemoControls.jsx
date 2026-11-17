import { useDemo } from '../context/DemoContext.jsx';
import styles from './DemoControls.module.css';

// A visible panel for reproducing the problems this site is designed to solve.
export default function DemoControls() {
  const { failLoad, seatScenario, update, reset } = useDemo();
  const active = failLoad || seatScenario !== 'normal';

  return (
    <details className={styles.wrap}>
      <summary className={styles.summary}>
        Demo controls
        {active && <span className={styles.badge}>active</span>}
      </summary>

      <div className={styles.panel}>
        <p className={styles.intro}>
          Use these switches to reproduce the edge cases. They affect the mock data only.
        </p>

        <div className={styles.field}>
          <label htmlFor="demo-fail-load">
            <input
              id="demo-fail-load"
              type="checkbox"
              checked={failLoad}
              onChange={(event) => update({ failLoad: event.target.checked })}
            />
            Force event loading to fail
          </label>
          <p className={styles.hint}>Shows the error and Retry state on the listing and details pages.</p>
        </div>

        <div className={styles.field}>
          <label htmlFor="demo-seat-scenario">Availability scenario</label>
          <select
            id="demo-seat-scenario"
            value={seatScenario}
            onChange={(event) => update({ seatScenario: event.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="sold_out">Data Visualisation Bootcamp sold out</option>
            <option value="low_seats">Only 2 seats on every event</option>
          </select>
          <p className={styles.hint}>
            Change this while tickets are in your selection to see the restored-selection warning.
          </p>
        </div>

        <button type="button" className={styles.reset} onClick={reset}>
          Reset demo controls
        </button>
      </div>
    </details>
  );
}
