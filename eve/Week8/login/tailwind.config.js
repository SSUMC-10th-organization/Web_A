/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#FF008A', // 자주 쓰시는 핑크색을 미리 등록해두면 편해요!
      }
    },
  },
  plugins: [],
}