import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useEvents } from '../api/useEvents.js';
import EventCard from '../components/EventCard.jsx';
import styles from './EventsPage.module.css';

const SORT_OPTIONS = [
  { value: 'date', label: 'Date (soonest first)' },
  { value: 'price-asc', label: 'Price (low to high)' },
  { value: 'price-desc', label: 'Price (high to low)' },
];

function matchesSearch(event, term) {
  if (!term) return true;
  // Search the text people would actually type, including the area and venue.
  const text = [event.title, event.description, event.category, event.venue, event.area, event.time]
    .join(' ')
    .toLowerCase();
  return text.includes(term);
}

export default function EventsPage() {
  const { events, loading, error, reload } = useEvents();
  const [params, setParams] = useSearchParams();

  // Reading state from the URL means refresh and Back/Forward restore the same view.
  const q = params.get('q') || '';
  const category = params.get('category') || 'all';
  const availableOnly = params.get('available') === '1';
  const sort = params.get('sort') || 'date';

  const categories = useMemo(
    () => [...new Set(events.map((event) => event.category))].sort(),
    [events],
  );

  const visibleEvents = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = events.filter((event) => {
      const matchesCategory = category === 'all' || event.category === category;
      const matchesAvailability = !availableOnly || event.seatsRemaining > 0;
      return matchesSearch(event, term) && matchesCategory && matchesAvailability;
    });

    // filter() returns a new array, so sorting here never mutates the source data.
    return filtered.sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
    });
  }, [events, q, category, availableOnly, sort]);

  function updateParam(name, value) {
    const next = new URLSearchParams(params);
    if (!value || value === 'all' || value === 'date') next.delete(name);
    else next.set(name, value);
    setParams(next); // push a history entry so Back/Forward step through changes
  }

  function clearFilters() {
    setParams(new URLSearchParams());
  }

  const hasFilters = Boolean(q) || category !== 'all' || availableOnly || sort !== 'date';

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <h1>Events in Islamabad</h1>
        <p>Workshops, talks and weekend plans. Prices include the service fee; groups of 4+ save 10%.</p>
      </header>

      <form className={styles.filters} aria-label="Filter events" onSubmit={(event) => event.preventDefault()}>
        <div className={styles.field}>
          <label htmlFor="event-search">Search</label>
          <input
            id="event-search"
            type="search"
            value={q}
            placeholder="Try “workshop” or “F-6”"
            onChange={(event) => updateParam('q', event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="event-category">Category</label>
          <select id="event-category" value={category} onChange={(event) => updateParam('category', event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="event-sort">Sort by</label>
          <select id="event-sort" value={sort} onChange={(event) => updateParam('sort', event.target.value)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => updateParam('available', event.target.checked ? '1' : '')}
          />
          Available only
        </label>

        {hasFilters && (
          <button type="button" className={styles.clear} onClick={clearFilters}>Clear filters</button>
        )}
      </form>

      {loading && <p className={styles.status} role="status">Loading events…</p>}

      {error && (
        <div className={styles.error} role="alert">
          <p>We couldn't load events. Please try again.</p>
          <button type="button" className={styles.retry} onClick={reload}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className={styles.count} aria-live="polite">
            {visibleEvents.length} of {events.length} events shown
          </p>

          {events.length === 0 ? (
            <div className={styles.empty}>
              <h2>No events are listed yet</h2>
              <p>Check back soon — new events are added regularly.</p>
              <Link to="/">Back to home</Link>
            </div>
          ) : visibleEvents.length === 0 ? (
            <div className={styles.empty}>
              <h2>No events match your filters</h2>
              <p>Try a shorter search, another category, or turn off “Available only”.</p>
              <button type="button" className={styles.retry} onClick={clearFilters}>Clear filters</button>
            </div>
          ) : (
            <ul className={styles.grid}>
              {visibleEvents.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
