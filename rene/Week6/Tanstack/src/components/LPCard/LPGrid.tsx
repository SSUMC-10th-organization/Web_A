import type { LP } from "../../types/lp";
import LPCard from "./LPCard";

interface LPGridProps {
  lps: LP[];
}

const LPGrid = ({ lps }: LPGridProps) => {
  if (lps.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500">등록된 LP가 없습니다.</div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
      {lps.map((lp) => (
        <LPCard key={lp.id} lp={lp} />
      ))}
    </div>
  );
};

export default LPGrid;
