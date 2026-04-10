import type { InputHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: FieldError;
};

const FormInput = ({ error, ...props }: FormInputProps) => {
  return (
    <div>
      <input
        {...props}
        className={`w-full border rounded-md px-4 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors ${
          error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-300 focus:border-pink-400"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};

export default FormInput;
