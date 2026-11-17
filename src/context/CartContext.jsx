import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { checkCapacity } from '../rules/capacity.js';

const STORAGE_KEY = 'ticketnest.cart.v1';
const CartContext = createContext(null);

// Only ids and quantities are stored — never personal or payment data.
function readStoredItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item.id === 'string' && Number.isInteger(item.quantity))
      .map(({ id, quantity }) => ({ id, quantity }));
  } catch {
    return []; // broken or blocked storage should not stop the app loading
  }
}

function applyQuantity(items, id, quantity) {
  if (quantity < 1) return items.filter((item) => item.id !== id);
  if (items.some((item) => item.id === id)) {
    return items.map((item) => (item.id === id ? { ...item, quantity } : item));
  }
  return [...items, { id, quantity }];
}

function reducer(items, action) {
  switch (action.type) {
    case 'add': {
      const existing = items.find((item) => item.id === action.id);
      const wanted = (existing?.quantity ?? 0) + 1;
      const check = checkCapacity(wanted, action.max);
      // clamp rather than discard: at the limit the selection simply stays unchanged
      return applyQuantity(items, action.id, check.valid ? wanted : check.allowedMax);
    }

    case 'set': {
      if (action.quantity < 1) return items.filter((item) => item.id !== action.id);
      const check = checkCapacity(action.quantity, action.max);
      return applyQuantity(items, action.id, check.valid ? action.quantity : check.allowedMax);
    }

    case 'remove':
      return items.filter((item) => item.id !== action.id);

    case 'clear':
      return [];

    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, readStoredItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private browsing may block writes; the in-memory cart still works.
    }
  }, [items]);

  const value = useMemo(() => ({ items, dispatch }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
