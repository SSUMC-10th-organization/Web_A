import { useCartInfo } from '../hooks/useCartStore';
import CartItem from "./CartItem";

const CartList = () => {
    const {cartItems} = useCartInfo();

    return (
        <div className="flex flex-col items-center justify-center">
            <ul>
                {cartItems.map((item, index) => (
                    <CartItem key={index} lp={item} />
                ))}
            </ul>
        </div>
    );
};

export default CartList;