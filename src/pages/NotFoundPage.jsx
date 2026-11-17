import { Link } from 'react-router-dom';
import Notice from '../components/Notice.jsx';

export default function NotFoundPage() {
  return (
    <Notice title="Page not found">
      <p>That address doesn't match a TicketNest page. It may have a typo in the URL.</p>
      <p><Link to="/">Go home</Link> · <Link to="/events">Browse events</Link></p>
    </Notice>
  );
}
