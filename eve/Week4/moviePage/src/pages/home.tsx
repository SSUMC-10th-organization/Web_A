export default function HomePage() {
    return (
        <div className="bg-white min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-extrabold text-black mb-6 tracking-tight">
                WELCOME TO <span className="text-[#ff4757]">HOON MOVIE</span>
            </h1>
            
            <p className="text-xl text-gray-500 font-medium max-w-lg leading-relaxed">
                최신 개봉작부터 평점 높은 명작까지, <br />
                당신이 찾는 모든 영화를 한눈에 확인하세요.
            </p>

            <div className="w-20 h-1.5 bg-[#e9d5ff] mt-8 rounded-full"></div>

            <div className="mt-12 text-sm text-gray-400 font-bold uppercase tracking-widest">
                Select a category from the menu above
            </div>
        </div>
    );
}