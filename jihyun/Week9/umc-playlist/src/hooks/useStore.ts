import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

interface CartActions {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
  actions: CartActions;
}

interface ModalActions {
  openModal: () => void;
  closeModal: () => void;
}

interface ModalState {
  isOpen: boolean;
  actions: ModalActions;
}

export const useCartStore = create<CartState>()(
  immer((set) => ({
    cartItems: cartItems,
    amount: 0,
    total: 0,
    actions: {
      increase: (id: string) =>
        set((state) => {
          const item = state.cartItems.find((i) => i.id === id);
          if (item) item.amount += 1;
        }),

      decrease: (id: string) =>
        set((state) => {
          const item = state.cartItems.find((i) => i.id === id);
          if (item && item.amount > 0) item.amount -= 1;
        }),

      removeItem: (id: string) =>
        set((state) => {
          state.cartItems = state.cartItems.filter((i) => i.id !== id);
        }),

      clearCart: () =>
        set((state) => {
          state.cartItems = [];
          state.amount = 0;
          state.total = 0;
        }),

      calculateTotals: () =>
        set((state) => {
          let amount = 0;
          let total = 0;
          for (const item of state.cartItems) {
            amount += item.amount;
            total += item.amount * item.price;
          }
          state.amount = amount;
          state.total = total;
        }),
    },
  })),
);

export const useModalStore = create<ModalState>()(
  immer((set) => ({
    isOpen: false,
    actions: {
      openModal: () =>
        set((state) => {
          state.isOpen = true;
        }),
      closeModal: () =>
        set((state) => {
          state.isOpen = false;
        }),
    },
  })),
);

export const useCartInfo = () =>
  useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      amount: state.amount,
      total: state.total,
    })),
  );

export const useCartActions = () => useCartStore((state) => state.actions);

export const useModalInfo = () =>
  useModalStore(useShallow((state) => ({ isOpen: state.isOpen })));

export const useModalActions = () => useModalStore((state) => state.actions);
