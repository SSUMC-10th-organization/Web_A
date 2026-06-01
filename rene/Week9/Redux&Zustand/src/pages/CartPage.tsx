import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useCustomRedux';
import { clearCart, calculateTotals } from '../features/cart/cartSlice';
import { closeModal } from '../features/modal/modalSlice';
import CartList from '../components/CartList';
import ConfirmModal from '../components/ConfirmModal';
import PriceBox from '../components/PriceBox';

export default function CartPage() {
  const dispatch = useAppDispatch(); // dispatch 함수 가져오기
  const { cartItems } = useAppSelector((state) => state.cart); // cartItems 상태 가져오기
  const isModalOpen = useAppSelector((state) => state.modal.isOpen);

  useEffect(() => {
    dispatch(calculateTotals());
  }, [cartItems, dispatch]);

  // 전체 삭제 -> 예 핸들러
  const handleConfirmClear = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  return (
    <div className="bg-white min-h-full">
      {isModalOpen && (
        <ConfirmModal
          onConfirm={handleConfirmClear}
          onCancel={() => dispatch(closeModal())}
        />
      )}
      <CartList />
      <PriceBox />
    </div>
  );
}
