/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "#0E0F11",
        green: {
          400: "#CCFF00",
          500: "#B2E600",
        },
        blueGray: {
          950: "#0E0F11",
        },
        gray: {
          800: "#454545",
          900: "#3D3D3D",
        },
      },
      fontFamily: {
        body: ['"Clash Grotesk"', "sans-serif"],
        heading: ['"Clash Grotesk"', "sans-serif"],
      },
      fontSize: {
        "7xl": ["3.875rem", { lineHeight: "1" }],
        "8xl": ["4.5rem", { lineHeight: "1" }],
        "10xl": ["6rem", { lineHeight: "1" }],
      },
      letterSpacing: {
        tighter: "-0.026em",
        "tighter-xl": "-1.86px",
        "8xl": "-3.6px",
      },
      borderRadius: {
        "5xl": "1.875rem",
      },
      backgroundImage: {
        "gradient-radial-dark":
          "radial-gradient(72.20% 78.49% at 49.87% 50.10%, rgba(71, 80, 98, 0.26) 0%, rgba(137, 137, 137, 0.00) 100%)",
        "gradient-card": "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(0, 0, 0, 0.00) 6.77%, #000 100%)",
      },
    },
  },
  plugins: [],
};
