import { Link } from 'react-router-dom';
import Notice from '../components/Notice.jsx';

export default function CheckoutPage() {
  return (
    <Notice title="Checkout">
      <p>Your ticket selection, registration form and live price summary appear here in Milestone 3.</p>
      <Link to="/events">Back to events</Link>
    </Notice>
  );
}
