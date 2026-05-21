import { useSearchParams } from "react-router-dom";
import type { OrderType } from "../apis/lp";
import type { SearchType } from "./queries/useInfiniteSearchLPs";

export const useSearchState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const keyword = searchParams.get("q") ?? "";
  const searchType = (searchParams.get("type") ?? "title") as SearchType;
  const order = (searchParams.get("order") ?? "desc") as OrderType;

  const setKeyword = (value: string) =>
    setSearchParams((prev) => {
      prev.set("q", value);
      if (!value) prev.delete("q");
      return prev;
    }, { replace: true });

  const setSearchType = (value: SearchType) =>
    setSearchParams((prev) => { prev.set("type", value); return prev; }, { replace: true });

  const setOrder = (value: OrderType) =>
    setSearchParams((prev) => { prev.set("order", value); return prev; }, { replace: true });

  return { keyword, searchType, order, setKeyword, setSearchType, setOrder };
};
