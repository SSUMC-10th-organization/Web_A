import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const PriceBox = () => {
    const { total, cartItems } = useCartInfo();
    const { openModal } = useCartActions();

    if (cartItems.length === 0) {
        return (
            <div className="p-12 flex justify-center">
                <p className="text-2xl font-semibold">장바구니가 비어있습니다.</p>
            </div>
        );
    }

    return (
        <div className="p-12 flex justify-between">
            <button
                onClick={openModal}
                className="border p-4 rounded-md cursor-pointer"
            >
                전체 삭제
            </button>
            <div>총 가격 : {total}원</div>
        </div>
    );
};

export default PriceBox;