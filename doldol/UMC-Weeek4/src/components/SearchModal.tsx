import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import useGetInfiniteLpsByTag from "../hooks/queries/useGetInfiniteLpsByTag";
import { PAGINATION_ORDER } from "../types/common";

type SearchType = "name" | "tag";

const RECENT_KEY = "recentSearches";
const MAX_RECENT = 8;

const getRecentSearches = (): string[] => {
	try {
		const raw = localStorage.getItem(RECENT_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch { return []; }
};

const saveRecentSearch = (query: string) => {
	try {
		const prev = getRecentSearches();
		const next = [query, ...prev.filter((q) => q !== query)].slice(0, MAX_RECENT);
		localStorage.setItem(RECENT_KEY, JSON.stringify(next));
	} catch { /* ignore */ }
};

const removeRecentSearch = (query: string) => {
	try {
		const next = getRecentSearches().filter((q) => q !== query);
		localStorage.setItem(RECENT_KEY, JSON.stringify(next));
	} catch { /* ignore */ }
};

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
	const navigate = useNavigate();
	const [searchType, setSearchType] = useState<SearchType>("name");
	const [input, setInput] = useState("");
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const debouncedQuery = useDebounce(input, 300);
	const hasQuery = debouncedQuery.trim().length > 0;

	const nameResult = useGetInfiniteLpList({
		search: hasQuery ? debouncedQuery : undefined,
		order: PAGINATION_ORDER.desc,
	});

	const tagResult = useGetInfiniteLpsByTag({
		tagName: debouncedQuery,
		enabled: searchType === "tag" && hasQuery,
	});

	const result = searchType === "name" ? nameResult : tagResult;
	const lps = hasQuery ? (result.data?.pages.flatMap((p) => p.data.data) ?? []) : [];

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                setInput("");
                setSearchType("name");
                setRecentSearches(getRecentSearches());
                inputRef.current?.focus();
            }, 50);
        }
    }, [isOpen]);

	if (!isOpen) return null;

	const handleSelect = (lpId: number, query: string) => {
		if (query.trim()) saveRecentSearch(query.trim());
		onClose();
		navigate(`/lp/${lpId}`);
	};

	const handleRecentClick = (query: string) => {
		setInput(query);
		inputRef.current?.focus();
	};

	const handleRemoveRecent = (query: string, e: React.MouseEvent) => {
		e.stopPropagation();
		removeRecentSearch(query);
		setRecentSearches(getRecentSearches());
	};

	const handleClearAll = () => {
		localStorage.removeItem(RECENT_KEY);
		setRecentSearches([]);
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-20"
			onClick={onClose}
		>
			<div
				className="w-full max-w-lg rounded-xl bg-gray-900 shadow-2xl overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* 탭 */}
				<div className="flex border-b border-gray-800">
					{(["name", "tag"] as SearchType[]).map((type) => (
						<button
							key={type}
							type="button"
							onClick={() => { setSearchType(type); setInput(""); }}
							className={`flex-1 py-3 text-sm font-medium transition-colors ${
								searchType === type
									? "border-b-2 border-pink-500 text-pink-500"
									: "text-gray-400 hover:text-white"
							}`}
						>
							{type === "name" ? "LP 이름" : "태그"}
						</button>
					))}
					<button type="button" onClick={onClose} className="px-4 text-gray-400 hover:text-white text-xl">
						x
					</button>
				</div>

				{/* 입력 */}
				<div className="relative p-3">
					<svg className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
						<title>검색</title>
						<circle cx="11" cy="11" r="7" />
						<line x1="16.5" y1="16.5" x2="21" y2="21" />
					</svg>
					<input
						ref={inputRef}
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={searchType === "name" ? "LP 이름으로 검색..." : "태그명으로 검색..."}
						className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-8 pr-8 text-sm text-white placeholder-gray-500 focus:border-pink-500 focus:outline-none"
					/>
					{input && (
						<button type="button" onClick={() => setInput("")} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
							x
						</button>
					)}
				</div>

				<div className="max-h-80 overflow-y-auto">
					{/* 입력 없음 → 최근 검색어 */}
					{!hasQuery && (
						recentSearches.length === 0 ? (
							<p className="py-8 text-center text-sm text-gray-500">최근 검색어가 없습니다.</p>
						) : (
							<div className="px-4 pb-3">
								<div className="flex items-center justify-between py-2">
									<span className="text-xs text-gray-400">최근 검색어</span>
									<button type="button" onClick={handleClearAll} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
										전체 삭제
									</button>
								</div>
								<ul className="flex flex-col gap-1">
									{recentSearches.map((q) => (
										<li key={q}>
											<button
												type="button"
												onClick={() => handleRecentClick(q)}
												className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-200 hover:bg-gray-800 transition-colors"
											>
												<div className="flex items-center gap-2">
													<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-500">
														<title>최근</title>
														<circle cx="12" cy="12" r="9" />
														<polyline points="12 7 12 12 15 15" />
													</svg>
													<span>{q}</span>
												</div>
												<button
													type="button"
													onClick={(e) => handleRemoveRecent(q, e)}
													className="text-gray-500 hover:text-gray-300 transition-colors ml-2"
												>
													x
												</button>
											</button>
										</li>
									))}
								</ul>
							</div>
						)
					)}

					{/* 입력 있음 → 검색 결과 */}
					{hasQuery && (
						<>
							{result.isPending && (
								<div className="flex flex-col gap-2 p-3">
									{[...Array(4)].map((_, i) => (
										<div key={String(i)} className="flex animate-pulse items-center gap-3">
											<div className="h-12 w-12 flex-shrink-0 rounded bg-gray-700" />
											<div className="flex-1 space-y-1">
												<div className="h-3 w-3/4 rounded bg-gray-700" />
												<div className="h-3 w-1/2 rounded bg-gray-700" />
											</div>
										</div>
									))}
								</div>
							)}
							{!result.isPending && lps.length === 0 && (
								<p className="py-8 text-center text-sm text-gray-500">검색 결과가 없습니다.</p>
							)}
							{lps.length > 0 && (
								<ul className="divide-y divide-gray-800 pb-2">
									{lps.map((lp) => (
										<li key={lp.id}>
											<button
												type="button"
												onClick={() => handleSelect(lp.id, debouncedQuery)}
												className="flex w-full items-center gap-3 px-4 py-2 hover:bg-gray-800 transition-colors text-left"
											>
												<img
													src={lp.thumbnail}
													alt={lp.title}
													referrerPolicy="no-referrer"
													onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
													className="h-12 w-12 flex-shrink-0 rounded object-cover bg-gray-700"
												/>
												<div className="min-w-0 flex-1">
													<p className="truncate text-sm font-medium text-white">{lp.title}</p>
													{lp.tags.length > 0 && (
														<p className="truncate text-xs text-gray-400">
															{lp.tags.map((t) => `#${t.name}`).join(" ")}
														</p>
													)}
												</div>
											</button>
										</li>
									))}
								</ul>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default SearchModal;
