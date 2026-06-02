import useCartStore from '../zustand/useCartStore';

export default function NavBar() {
  const amount = useCartStore((state) => state.amount);

  return (
    <nav className="bg-[#1e2535] text-white px-8 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-wide">Rene Album</h1>
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7H19M7 13L5.4 5M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
        <span className="text-lg font-medium">{amount}</span>
      </div>
    </nav>
  );
}
