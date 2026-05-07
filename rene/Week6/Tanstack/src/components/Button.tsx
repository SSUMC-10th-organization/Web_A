import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ className = "", children, ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      className={`w-full mt-1 bg-gray-800 text-white py-3 rounded-md text-sm font-medium transition-colors
        enabled:cursor-pointer enabled:hover:bg-pink-600
        disabled:bg-gray-300 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
