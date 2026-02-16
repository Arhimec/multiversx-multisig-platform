/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2dd4bf',
                    hover: '#5eead4',
                    light: '#99f6e4',
                    dark: '#14b8a6',
                },
                accent: {
                    DEFAULT: '#0ea5e9',
                    hover: '#38bdf8',
                    dark: '#0284c7',
                },
                surface: {
                    DEFAULT: '#0c2329',
                    hover: '#112e36',
                    light: '#163840',
                    border: '#15393f',
                },
                bg: {
                    DEFAULT: '#091a1f',
                    secondary: '#0b2025',
                },
                success: '#10b981',
                warning: '#f59e0b',
                danger: '#ef4444',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'glow': 'glow 3s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.6' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(45, 212, 191, 0.3)' },
                    '50%': { boxShadow: '0 0 50px rgba(45, 212, 191, 0.5)' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
