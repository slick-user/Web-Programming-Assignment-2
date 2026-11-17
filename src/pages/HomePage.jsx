import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Islamabad · small events, big plans</p>
        <h1 className={styles.title}>Find your next thing to do.</h1>
        <p className={styles.lead}>
          Workshops, talks and weekend activities for students and young professionals. Browse,
          choose your tickets and get a confirmation — all in one calm place.
        </p>
        <div className={styles.actions}>
          <Link className={styles.primary} to="/events">Browse events</Link>
          <Link className={styles.secondary} to="/events?sort=price-asc">See lowest prices</Link>
        </div>
      </section>

      <section className={styles.steps} aria-labelledby="how-heading">
        <h2 id="how-heading" className={styles.sectionTitle}>How it works</h2>
        <ol className={styles.stepList}>
          <li><strong>Find.</strong> Search, filter and sort. Your choices stay in the address bar.</li>
          <li><strong>Choose.</strong> See costs up front, including the service fee and group discount.</li>
          <li><strong>Confirm.</strong> Register and receive a clearly labelled simulated booking reference.</li>
        </ol>
      </section>

      <p className={styles.note}>All bookings are simulated — no payment details are collected.</p>
    </div>
  );
}
