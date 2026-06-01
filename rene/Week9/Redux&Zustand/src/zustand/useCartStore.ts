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
};

type CartStore = CartState & CartActions;

// 상태 계산 로직을 별도의 함수로 분리
const recalculate = (cartItems: CartItemType[]) => ({
  amount: cartItems.reduce((sum, item) => sum + item.amount, 0),
  total: cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.amount,
    0,
  ),
});

const useCartStore = create<CartStore>((set) => ({
  cartItems: cartItemsData,
  ...recalculate(cartItemsData),

  increase: (id) => {
    set((state) => {
      const cartItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item,
      );
      return { cartItems, ...recalculate(cartItems) };
    });
  },

  decrease: (id) => {
    set((state) => {
      const item = state.cartItems.find((i) => i.id === id);
      if (!item) return state;
      const cartItems =
        item.amount - 1 < 1
          ? state.cartItems.filter((i) => i.id !== id)
          : state.cartItems.map((i) =>
              i.id === id ? { ...i, amount: i.amount - 1 } : i,
            );
      return { cartItems, ...recalculate(cartItems) };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const cartItems = state.cartItems.filter((item) => item.id !== id);
      return { cartItems, ...recalculate(cartItems) };
    });
  },

  clearCart: () => set({ cartItems: [], amount: 0, total: 0 }),
}));

export default useCartStore;
