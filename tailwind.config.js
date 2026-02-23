/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cream: '#FDFBF7',
                'cream-dark': '#F4F0EA',
                'ink-black': '#1A1018',
                'riso-purple': '#8E67B5',
                'riso-pink': '#E8436F',
                'riso-blue': '#4A90E2',
            },
            fontFamily: {
                serif: ['"Noto Serif Display"', 'serif'],
                body: ['"Lora"', 'serif'],
                script: ['"Sacramento"', 'cursive'],
            },
        },
    },
    plugins: [],
}
