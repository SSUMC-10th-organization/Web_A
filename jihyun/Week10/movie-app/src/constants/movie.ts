export interface LanguageOption {
  value: string;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "ko-KR", label: "한국어" },
  { value: "en-US", label: "영어" },
  { value: "ja-JP", label: "일본어" },
];

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const FALLBACK_IMAGE =
  "https://via.placeholder.com/500x750?text=No+Image";