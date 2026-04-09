import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <h1 className="text-2xl font-bold">환영합니다</h1>
            <button
                type="button"
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
                회원가입
            </button>
        </div>
    );
};

export default HomePage;