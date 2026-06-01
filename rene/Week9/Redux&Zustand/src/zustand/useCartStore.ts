import { create } from 'zustand';
import cartItemsData from '../constants/cartItems';
import type { CartItemType } from '../types/cart';

type CartState = {
  cartItems: CartItemType[];
  amount: number;
  total: number;
};

type CartActions = {
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
};

type CartStore = CartState & CartActions;

const useCartStore = create<CartStore>((set, get) => ({
  // 초기 상태 설정
  cartItems: cartItemsData,
  amount: cartItemsData.reduce((sum, item) => sum + item.amount, 0),
  total: cartItemsData.reduce(
    (sum, item) => sum + Number(item.price) * item.amount,
    0,
  ),

  // 상태 업데이트 함수들
  increase: (id) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      ),
    }));
    get().calculateTotals();
  },

  decrease: (id) => {
    set((state) => {
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return state;
      if (item.amount - 1 < 1) {
        return {
          cartItems: state.cartItems.filter((i) => i.id !== id),
        };
      }
      return {
        cartItems: state.cartItems.map((i) =>
          i.id === id ? { ...i, amount: i.amount - 1 } : i,
        ),
      };
    });
    get().calculateTotals();
  },

  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));
    get().calculateTotals();
  },

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),

  calculateTotals: () => {
    set((state) => ({
      amount: state.cartItems.reduce((sum, item) => sum + item.amount, 0),
      total: state.cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.amount,
        0,
      ),
    }));
  },
}));

export default useCartStore;
