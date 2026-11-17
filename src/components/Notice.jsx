import styles from './Notice.module.css';

// Simple shared panel for placeholder and error pages.
export default function Notice({ title, children }) {
  return (
    <div className={styles.notice}>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
