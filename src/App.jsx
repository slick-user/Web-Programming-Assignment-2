import styles from './App.module.css';

// Placeholder shell for Milestone 1. Routing and the real layout are added in Milestone 2.
export default function App() {
  return (
    <main className={styles.setup}>
      <p className={styles.eyebrow}>Islamabad · workshops, talks &amp; weekend plans</p>
      <h1 className={styles.title}>TicketNest</h1>
      <p className={styles.lead}>
        Project setup is ready. Event browsing, registration and confirmation arrive in the next
        milestone.
      </p>
      <p className={styles.note}>All orders on this site are simulated.</p>
    </main>
  );
}
