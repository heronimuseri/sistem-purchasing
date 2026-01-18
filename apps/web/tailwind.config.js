/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#667c31",
                "primary-light": "#849646",
                "background-light": "#fafaf5",
                "background-dash-light": "#f9f9f7",
                "background-dark": "#1f211c",
                "forest-charcoal": "#2C3A29",
                "forest": "#2C3A29", // Added alias
                "surface": "#ffffff",
                "urgent-yellow": "#fef08a",
                "accent-yellow": "#f2bf4e",
                "accent-red": "#d9534f",
                "card-light": "#F7F5F0",
                "primary-olive": "#6a7b31",
                "primary-dark": "#4d5a24",
                "olive-light": "#f4f6e9",
                "olive-light": "#f4f6e9",
                "cream-bg": "#fdfdf8",
                "plantation-gold": "#f2bf4e",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
}
