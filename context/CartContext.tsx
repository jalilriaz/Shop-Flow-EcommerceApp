"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { CartItem } from "@/lib/types/cart";

/* ─── Types ─── */
interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] }
  | { type: "MERGE_CART"; payload: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  mergeCart: (incomingItems: CartItem[]) => void;
}

/* ─── Reducer ─── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };

    case "MERGE_CART": {
      const mergedMap = new Map<string, CartItem>();
      state.items.forEach((item) => mergedMap.set(item.productId, { ...item }));
      action.payload.forEach((incoming) => {
        const existing = mergedMap.get(incoming.productId);
        if (existing) {
          existing.quantity = Math.min(existing.quantity + incoming.quantity, existing.stock);
        } else {
          mergedMap.set(incoming.productId, { ...incoming });
        }
      });
      return { items: Array.from(mergedMap.values()) };
    }

    case "ADD_ITEM": {
      const exists = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, i.stock) }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter((i) => i.productId !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: Math.max(1, Math.min(action.payload.quantity, i.stock)) }
            : i
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

/* ─── Context ─── */
const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "shopflow_cart";
const FREE_SHIPPING_THRESHOLD = 100;
const SHIPPING_COST = 9.99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce(
    (sum, i) => sum + (i.discountPrice ?? i.price) * i.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const isInCart = useCallback(
    (productId: string) => state.items.some((i) => i.productId === productId),
    [state.items]
  );

  const mergeCart = useCallback((incomingItems: CartItem[]) => {
    dispatch({ type: "MERGE_CART", payload: incomingItems });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        totalItems,
        subtotal,
        shipping,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        mergeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
