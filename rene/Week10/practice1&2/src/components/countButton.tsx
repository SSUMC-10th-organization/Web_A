import { memo } from "react";

interface CountButtonProps { 
  onClick: (count: number) => void;
}

const CountButton = ({ onClick }: CountButtonProps) => {
  console.log("🕹️CountButton rendered");
  return (
    <button 
      className="px-4 py-2 bg-blue-500 text-white rounded" 
      onClick={() => onClick(10)}
    >
      카운트 증가
    </button>
  )
}

export default memo(CountButton);