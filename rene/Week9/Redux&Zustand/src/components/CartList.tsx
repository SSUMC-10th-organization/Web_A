import useCartStore from '../zustand/useCartStore';
import CartItem from './CartItem';

export default function CartList() {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <div>
      {cartItems.map((item) => (
        <CartItem key={item.id} {...item} />
      ))}
    </div>
  );
}
