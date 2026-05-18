# Tailwind 설정 및 디자인 토큰

> **이 파일을 Claude Code에 전달하면 디자인 토큰을 코드로 바로 적용합니다.**

---

## 📄 tailwind.config.ts

```typescript
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
        // 메인 컬러 - Red
        red: {
          50: '#FDECEE',
          100: '#FCD5D9',
          500: '#EA2C38', // 메인
          600: '#D11F2A',
          700: '#A8161F',
        },
        // 보조 컬러 - Blue
        blue: {
          50: '#E6F2FA',
          100: '#CCE5F5',
          500: '#0081CC', // 보조
          600: '#006BA8',
          700: '#005687',
        },
        // 베이스
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
        // 자연
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
        // 타이포 스케일
        'display-1': ['4rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-2': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '800' }],
        'heading-1': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-2': ['1.75rem', { lineHeight: '1.3', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-3': ['1.375rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.6', letterSpacing: '-0.01em', fontWeight: '400' }],
        'body-small': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.8125rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        // 8px 그리드
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '30': '7.5rem',   // 120px
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.06)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'xl': '0 16px 40px rgba(0, 0, 0, 0.10)',
        'modal': '0 24px 64px rgba(0, 0, 0, 0.16)',
      },
      maxWidth: {
        'container': '1200px',
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'modalIn': 'modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'marqueeLeft': 'marqueeLeft 30s linear infinite',
        'marqueeRight': 'marqueeRight 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(16px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
```

---

## 📄 globals.css

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-white text-gray-900 font-sans antialiased;
    font-feature-settings: 'tnum' 1; /* 숫자 고정폭 */
    word-break: keep-all; /* 한글 단어 단위 줄바꿈 */
  }

  /* 한글 줄바꿈 최적화 */
  h1, h2, h3, h4, h5, h6, p, span, div {
    word-break: keep-all;
    overflow-wrap: break-word;
  }

  /* 포커스 인디케이터 */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-red-500;
  }

  /* 선택 영역 */
  ::selection {
    @apply bg-red-100 text-red-700;
  }
}

@layer components {
  /* 컨테이너 */
  .container-base {
    @apply mx-auto px-4 md:px-8 max-w-container;
  }

  /* 섹션 패딩 */
  .section-padding {
    @apply py-16 md:py-20 lg:py-24;
  }

  /* 카드 기본 */
  .card-base {
    @apply bg-white rounded-2xl shadow-md p-6
           transition-all duration-300 ease-out-soft
           hover:shadow-lg hover:-translate-y-1;
  }

  /* 버튼 - Primary */
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2
           px-6 py-3.5
           bg-red-500 hover:bg-red-600
           text-white font-medium text-base
           rounded-xl
           shadow-md hover:shadow-lg
           transition-all duration-200 ease-out-soft
           hover:-translate-y-0.5
           focus:outline-none focus:ring-4 focus:ring-red-500/20
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  /* 버튼 - Secondary */
  .btn-secondary {
    @apply inline-flex items-center justify-center gap-2
           px-6 py-3.5
           bg-white hover:bg-gray-50
           text-gray-900 font-medium text-base
           border-2 border-gray-200
           rounded-xl
           transition-all duration-200 ease-out-soft
           focus:outline-none focus:ring-4 focus:ring-gray-200/40;
  }

  /* 버튼 - Text */
  .btn-text {
    @apply inline-flex items-center gap-1
           text-red-500 hover:text-red-600 hover:underline
           font-medium transition-colors;
  }

  /* 입력 필드 */
  .input-base {
    @apply w-full px-4 py-3.5
           bg-gray-50 focus:bg-white
           text-base text-gray-900 placeholder-gray-500
           rounded-xl
           transition-all duration-200
           focus:outline-none focus:ring-4 focus:ring-red-500/10
           focus:border-2 focus:border-red-500;
  }

  /* 태그 - Red */
  .tag-red {
    @apply inline-flex items-center px-2.5 py-1
           bg-red-50 text-red-500
           text-xs font-medium rounded-md;
  }

  /* 태그 - Blue */
  .tag-blue {
    @apply inline-flex items-center px-2.5 py-1
           bg-blue-50 text-blue-500
           text-xs font-medium rounded-md;
  }
}

@layer utilities {
  /* 텍스트 줄임 (한 줄) */
  .truncate-1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 텍스트 줄임 (n줄) */
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 모바일에서 자동 줌 방지 */
  .no-zoom {
    font-size: 16px;
  }

  /* 스크롤바 숨김 */
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 📄 package.json (필수 의존성)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-checkbox": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@heroicons/react": "^2.1.0",
    "framer-motion": "^11.0.0",
    "sonner": "^1.4.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "@tiptap/react": "^2.2.0",
    "@tiptap/starter-kit": "^2.2.0",
    "@tiptap/extension-image": "^2.2.0",
    "@tiptap/extension-link": "^2.2.0",
    "html-to-image": "^1.11.0",
    "embla-carousel-react": "^8.0.0",
    "firebase": "^10.8.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.10",
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.11.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 📄 utils/cn.ts (클래스 병합 유틸)

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 📄 환경 변수 (.env.local 템플릿)

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# YouTube Data API
YOUTUBE_API_KEY=
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=UCxxxxx  # @with5340

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Admin (서버 사이드만)
ADMIN_EMAILS=admin@example.com
```

---

**Tailwind 설정 및 디자인 토큰 끝**
