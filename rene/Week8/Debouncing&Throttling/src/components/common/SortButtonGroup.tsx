type Size = "large" | "small";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface Props<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: Size;
}

const styles = {
  container: "rounded-lg border border-zinc-600",
  button: {
    large: "px-4 py-1.5 text-sm font-medium",
    small: "px-3 py-1 text-xs",
  },
  inactive: "text-zinc-400 hover:bg-zinc-800",
};

const SortButtonGroup = <T extends string>({
  options,
  value,
  onChange,
  size = "large",
}: Props<T>) => (
  <div className={`flex overflow-hidden ${styles.container}`}>
    {options.map((option) => (
      <button
        key={option.value}
        onClick={() => onChange(option.value)}
        className={`transition-colors ${styles.button[size]} ${
          value === option.value ? "bg-white text-black" : styles.inactive
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default SortButtonGroup;
