import { useEffect } from 'react';
import useCartStore from './store/useCartStore'; 
import Navbar from './components/Navbar';
import CartContainer from './components/CartContainer';
import Modal from './components/Modal';

export default function App() {
  const { cartItems, calculateTotals, isOpen } = useCartStore();

  useEffect(() => {
    calculateTotals();
  }, [cartItems, calculateTotals]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans antialiased text-gray-900 relative">
      <Navbar />
      <CartContainer />
      {isOpen && <Modal />}
    </main>
  );
}