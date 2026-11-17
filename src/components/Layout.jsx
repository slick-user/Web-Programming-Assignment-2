import { Link, NavLink, Outlet } from 'react-router-dom';
import DemoControls from './DemoControls.jsx';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link className={styles.brand} to="/">
            <span className={styles.brandMark} aria-hidden="true">TN</span>
            <span>TicketNest</span>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? styles.active : styles.navLink)}
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) => (isActive ? styles.active : styles.navLink)}
            >
              Events
            </NavLink>
          </nav>

          <span className={styles.simulated}>Simulated site</span>
        </div>
      </header>

      <div className={styles.demoBar}>
        <DemoControls />
      </div>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <p>
          TicketNest is a fictional demo for Islamabad events. No real payments, credentials or
          personal data are stored.
        </p>
      </footer>
    </div>
  );
}
