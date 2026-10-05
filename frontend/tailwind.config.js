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
        navy: {
          900: '#070C15',
          800: '#0B1220', // Primary deep navy
          700: '#111D32',
          600: '#1A2A47',
          500: '#263B61',
        },
        cyber: {
          blue: '#2563EB',
          lightBlue: '#3B82F6',
          sky: '#60A5FA',
          cyan: '#06B6D4',
        },
        status: {
          safe: '#16A34A',
          warning: '#F59E0B',
          danger: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.35)',
        'glow-red': '0 0 25px -5px rgba(220, 38, 38, 0.35)',
        'glow-green': '0 0 25px -5px rgba(22, 163, 74, 0.35)',
        'card-subtle': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        radarScan: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'radar-scan': 'radarScan 8s linear infinite',
      }
    },
  },
  plugins: [],
}
