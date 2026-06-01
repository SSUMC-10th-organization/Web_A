import { useAppSelector } from '../hooks/useCustomRedux';
import CartItem from './CartItem';

export default function CartList() {
  const cartItems = useAppSelector((state) => state.cart.cartItems);

  return (
    <div>
      {cartItems.map((item) => (
        <CartItem key={item.id} {...item} />
      ))}
    </div>
  );
}
