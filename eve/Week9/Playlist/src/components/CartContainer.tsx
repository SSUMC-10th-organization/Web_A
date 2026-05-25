import useCartStore from '../store/useCartStore';
import CartItem from './CartItem';

export default function CartContainer() {
  const { cartItems, total, openModal } = useCartStore();

  if (cartItems.length < 1) {
    return (
      <section className="max-w-xl mx-auto my-12 text-center px-4">
        <header>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-4 tracking-tight">당신의 장바구니</h2>
          <p className="text-gray-400 text-sm">현재 장바구니가 비어 있습니다. 🎧</p>
        </header>
      </section>
    );
  }

  return (
    <section className="max-w-xl mx-auto my-8 px-4 pb-16">
      <header className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">당신의 장바구니</h2>
      </header>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <hr className="my-6 border-gray-200" />

      <footer>
        <div className="flex justify-between items-center mb-6 px-1">
          <span className="font-semibold text-gray-700 text-base">총 결제 금액</span>
          <span className="font-extrabold text-xl text-indigo-600">{total.toLocaleString()}원</span>
        </div>
        
        <button 
          type="button"
          onClick={openModal}
          className="w-full py-3 bg-red-50 text-red-500 font-bold rounded-xl border border-red-200 hover:bg-red-500 hover:text-white transition duration-200 shadow-sm active:scale-[0.99]"
        >
          장바구니 비우기
        </button>
      </footer>
    </section>
  );
}