import { useState } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../../assets/search-icon.svg";
import personIcon from "../../assets/person-icon.svg";
import ConfirmModal from "../ConfirmModal";
import { useWithdraw } from "../../hooks/mutations/useWithdraw";

const SideBar = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: withdraw, isPending } = useWithdraw(() => setShowConfirm(false));

  return (
    <>
      <aside className="w-44 h-full bg-zinc-900 flex flex-col border-r border-zinc-800 shrink-0">
        <nav className="flex-1 flex flex-col pt-4">
          <Link
            to="/"
            className="flex items-center gap-3 px-6 py-3 text-white hover:bg-zinc-900 transition-colors"
          >
            <img src={searchIcon} alt="search" className="w-4 h-4" />
            <span className="text-sm">찾기</span>
          </Link>

          <Link
            to="/mypage"
            className="flex items-center gap-3 px-6 py-3 text-white hover:bg-zinc-900 transition-colors"
          >
            <img src={personIcon} alt="person" className="w-4 h-4" />
            <span className="text-sm">마이페이지</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-zinc-800">
          <button
            onClick={() => setShowConfirm(true)}
            className="text-gray-500 text-sm hover:text-red-400 transition-colors"
          >
            탈퇴하기
          </button>
        </div>
      </aside>

      {showConfirm && (
        <ConfirmModal
          message={"정말로 탈퇴하시겠습니까?\n이 작업은 되돌릴 수 없습니다."}
          onConfirm={() => withdraw()}
          onCancel={() => setShowConfirm(false)}
          isPending={isPending}
        />
      )}
    </>
  );
};

export default SideBar;
