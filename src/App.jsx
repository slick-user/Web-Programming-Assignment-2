import { Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailsPage from './pages/EventDetailsPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import ConfirmationPage from './pages/ConfirmationPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// The layout wraps every route; Outlet decides which page appears in the middle.
export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}
