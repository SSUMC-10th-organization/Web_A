import { memo } from "react";

interface TextInputProps {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: TextInputProps) => {
  //console.log("✏️TextInput rendered");
  return (
    <input
      type="text"
      className="border border-gray-300 rounded px-4 py-2"
      placeholder="Enter text..."
      onChange={(e) => onChange(e.target.value)}
    />
  )
};

export default memo(TextInput);