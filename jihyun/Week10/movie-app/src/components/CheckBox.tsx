interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  id: string;
  className?: string;
}

export const CheckBox = ({
  checked,
  onChange,
  label,
  id,
  className = "",
}: CheckBoxProps) => {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-gray-300 bg-gray-200 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 cursor-pointer text-sm text-gray-700">
        {label}
      </label>
    </div>
  );
};