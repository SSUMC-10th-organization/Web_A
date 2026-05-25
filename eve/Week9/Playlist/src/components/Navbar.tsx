import useCartStore from '../store/useCartStore';

export default function Navbar() {
  const { amount } = useCartStore();

  return (
    <nav className="bg-indigo-600 text-white p-4 sticky top-0 shadow-md z-10">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold tracking-wider">UMC PlayList</h1>
        
        <div className="relative cursor-pointer p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-indigo-600">
            {amount}
          </span>
        </div>
      </div>
    </nav>
  );
}