/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    safelist: [
      "max-h-[50%]",
      "border-green-500",
      "text-green-500",
      "border-yellow-500",
      "text-yellow-500",
      "border-red-400",
      "text-red-400",
    ],
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "dg-header": "rgba(10, 18, 27, 0.8)",
        link: "#96a2ff",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
