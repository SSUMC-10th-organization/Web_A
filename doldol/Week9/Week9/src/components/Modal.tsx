import { useCartActions, useCartInfo } from "../hooks/useCartStore";

const Modal = () => {
    const { isOpen } = useCartInfo();
    const { clearCart, closeModal } = useCartActions();

    if (!isOpen) return null;

    const handleNo = () => {
        closeModal();
    };

    const handleYes = () => {
        clearCart();
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-lg">
                <p className="text-lg font-semibold">정말 삭제하시겠습니까?</p>
                <div className="flex gap-4">
                    <button
                        onClick={handleYes}
                        className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer"
                    >
                        네
                    </button>
                    <button
                        onClick={handleNo}
                        className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer"
                    >
                        아니요
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;