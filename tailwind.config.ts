import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: '#FDECEE',
          100: '#FCD5D9',
          500: '#EA2C38',
          600: '#D11F2A',
          700: '#A8161F',
        },
        blue: {
          50: '#E6F2FA',
          100: '#CCE5F5',
          500: '#0081CC',
          600: '#006BA8',
          700: '#005687',
        },
        cream: {
          50: '#FAF7F2',
          100: '#F3EEE5',
        },
        gray: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        green: {
          100: '#E8EFE2',
          300: '#A8C193',
          500: '#7FA968',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'Helvetica Neue',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-1': ['4rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-2': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-2': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-3': ['1.375rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '500' }],
        body: ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-small': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        caption: ['0.8125rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.04)',
        md: '0 4px 12px rgba(0, 0, 0, 0.06)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.08)',
        xl: '0 16px 40px rgba(0, 0, 0, 0.10)',
        modal: '0 24px 64px rgba(0, 0, 0, 0.16)',
      },
      maxWidth: {
        container: '1200px',
      },
      animation: {
        fadeIn: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        modalIn: 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        slideUp: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        marqueeLeft: 'marqueeLeft 30s linear infinite',
        marqueeRight: 'marqueeRight 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, calc(-50% + 16px)) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marqueeLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
