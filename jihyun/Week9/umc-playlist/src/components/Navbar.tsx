import { useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCartActions, useCartInfo } from "../hooks/useStore";

export default function Navbar() {
  const { amount } = useCartInfo();
  const { calculateTotals } = useCartActions();

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 text-white shadow-lg">
      <button
        type="button"
        className="text-2xl font-bold cursor-pointer hover:text-pink-400 transition-colors bg-transparent border-none text-white"
        onClick={() => {
          window.location.href = "/";
        }}
        onKeyUp={() => {
          window.location.href = "/";
        }}
      >
        🎵 UMC PlayList
      </button>
      <div className="flex items-center gap-2">
        <FaShoppingCart className="text-2xl text-pink-400" />
        <span className="text-lg font-medium bg-pink-500 text-white rounded-full px-2 py-0.5 min-w-[28px] text-center">
          {amount}
        </span>
      </div>
    </nav>
  );
}
