import { Link } from 'react-router-dom';
import Notice from '../components/Notice.jsx';

export default function ConfirmationPage() {
  return (
    <Notice title="Confirmation">
      <p>Your simulated booking reference will appear here once registration is built in Milestone 3.</p>
      <Link to="/events">Back to events</Link>
    </Notice>
  );
}
