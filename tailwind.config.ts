import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        db: "#102C57",
        dcoffe: "#DAC0A3",
        vdcoffe: "#6F4E37",
        lcoffe: "#EADBC8",
      },
    },
  },
  plugins: [],
} satisfies Config;
