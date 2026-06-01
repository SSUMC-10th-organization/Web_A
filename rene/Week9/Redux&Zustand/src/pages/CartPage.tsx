import useCartStore from '../zustand/useCartStore';
import useModalStore from '../zustand/useModalStore';
import CartList from '../components/CartList';
import ConfirmModal from '../components/ConfirmModal';
import PriceBox from '../components/PriceBox';

export default function CartPage() {
  const { clearCart } = useCartStore();
  const { isOpen: isModalOpen, closeModal } = useModalStore();

  const handleConfirmClear = () => {
    clearCart();
    closeModal();
  };

  return (
    <div className="bg-white min-h-full">
      {isModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmClear}
          onCancel={closeModal}
        />
      )}
      <CartList />
      <PriceBox />
    </div>
  );
}
