import { create } from 'zustand';
import cartItems from '../constants/cartItems';
import type { CartItemType } from '../constants/cartItems';

interface CartState {
  cartItems: CartItemType[];
  amount: number;
  total: number;
  isOpen: boolean; 

  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
  

  openModal: () => void;  
  closeModal: () => void; 
  confirmClearCart: () => void; 
}

const useCartStore = create<CartState>((set) => ({
  cartItems: cartItems,
  amount: 0,
  total: 0,
  isOpen: false, 

  increase: (id) =>
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    })),

  decrease: (id) =>
    set((state) => {
      const updatedItems = state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount - 1 } : item
      );
      const filteredItems = updatedItems.filter((item) => item.amount >= 1);
      return { cartItems: filteredItems };
    }),

  removeItem: (id) =>
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    })),

  clearCart: () =>
    set({
      cartItems: [],
      amount: 0,
      total: 0,
    }),

  calculateTotals: () =>
    set((state) => {
      let currentAmount = 0;
      let currentTotal = 0;
      state.cartItems.forEach((item) => {
        currentAmount += item.amount;
        currentTotal += item.amount * Number(item.price);
      });
      return { amount: currentAmount, total: currentTotal };
    }),

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),

  confirmClearCart: () =>
    set({
      cartItems: [], 
      amount: 0,      
      total: 0,       
      isOpen: false,  
    }),
}));

export default useCartStore;