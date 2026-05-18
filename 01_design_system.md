# 이권재 더큰오산 캠프 홈페이지 — 디자인 시스템 가이드

> **이 문서를 Claude Code에 전달하면 사이트 전체의 디자인 일관성을 보장합니다.**
> 모든 페이지·컴포넌트 제작 시 이 가이드를 우선 참조합니다.

---

## 📜 디자인 철학 (Design Philosophy)

### 핵심 원칙 6가지

#### 1. 일을 보여주는 디자인 (Work-Speaks Design)
디자인이 후보를 꾸미는 게 아니라, 후보의 일을 명확하게 보여준다. 화려한 장식 없이 정보 자체가 주인공. 군더더기 없는 레이아웃 = "일 잘하는 후보"의 시각적 은유.

#### 2. 한글의 진심 (Hangul-First)
영문은 도메인·URL·기술 표기를 제외하고 사용하지 않는다. "ABOUT", "VISION" 같은 의미 없는 영문 소제목 금지. 모든 헤드라인·서브 카피·버튼은 한글.

#### 3. 면(面)으로 짓는 도시 (Solid Surface)
선으로 가르지 않고, 면으로 구분한다. 라인·구분선 최소화. 컬러 면, 배경 톤 변화, 여백으로 영역 구분.

#### 4. 투명한 신뢰 (Transparent Trust)
숨길 게 없는 후보, 숨길 게 없는 디자인. 깔끔하고 정직한 정보 노출. 과장된 그래픽 X, 데이터·실적 그대로. 화이트 베이스 + 충분한 여백 = 투명함의 시각화.

#### 5. 모던하지만 친근하게 (Modern yet Warm)
젊은 사람이 봐도 세련되게, 어르신이 봐도 어렵지 않게. 모던한 그리드·여백·타이포 + 친근한 펠트/클레이 톤의 3D 일러스트.

#### 6. 의미 있는 모든 픽셀 (Every Pixel Earns Its Place)
장식은 디자인이 아니다. 의미 없는 도형·그라데이션·패턴 사용 금지. 모든 시각 요소는 정보 전달·이해 보조·감정 환기 중 하나의 기능을 해야 함.

---

## ❌ 절대 피할 것 (Anti-Patterns)

| 피해야 할 것 | 이유 |
|---|---|
| Electrolize, Orbitron 등 "AI/테크 느낌" 폰트 | 후보 톤과 불일치, 시민 거리감 |
| "ABOUT", "VISION", "MISSION" 같은 영문 소제목 | 의미 없는 꾸밈, 한글 사이트에서 어색 |
| 의미 없는 추상 도형, 패턴, 그라데이션 장식 | 일 잘하는 후보 톤과 충돌 |
| 모든 섹션을 라인으로 가르기 | 답답함, 옛 사이트 느낌 |
| 과한 호버 애니메이션, 화려한 트랜지션 | 정치 사이트 신뢰감 ↓ |
| 다크 모드, 화려한 네온·형광 컬러 | 후보 톤 부적합 |
| "Welcome to...", "Hello!" 등 가벼운 영문 인사 | 진정성 부족 |
| 풍선·반짝이·이모지 폭탄 같은 과장 그래픽 | 가벼운 인상 |
| 의미 없는 카드 그림자, 깊이감 남발 | 시각적 노이즈 |

---

## ✅ 지향할 것 (Design DNA)

| 지향하는 것 | 이유 |
|---|---|
| 큰 한글 타이포 + 충분한 행간 | 메시지 강력 전달 |
| 화이트 베이스 + 컬러 포인트 절제 | 깔끔함, 투명성 |
| 펠트/클레이 3D 일러스트 (SVG) | 친근감, 차별화 |
| 섹션 구분은 배경 톤 변화로 | 면 위주, 라인 X |
| 빨강은 강조 포인트로만 (10% 사용) | 절제된 사용 |
| 짧고 명확한 한 줄 카피 | 가독성, 신뢰감 |
| 부드러운 모서리(12~24px) | 친근감, 모던함 |

---

## 🎨 컬러 시스템

### 메인 컬러 — Red (#EA2C38)

| 토큰 | HEX | RGB | 사용처 |
|---|---|---|---|
| `red-50` | `#FDECEE` | 253,236,238 | 강조 영역 배경 (응원 카운터) |
| `red-100` | `#FCD5D9` | 252,213,217 | 호버 배경 |
| `red-500` | `#EA2C38` | 234,44,56 | **메인 - CTA 버튼, 활성 메뉴, 기호 2** |
| `red-600` | `#D11F2A` | 209,31,42 | 버튼 호버 |
| `red-700` | `#A8161F` | 168,22,31 | 텍스트 강조 (소수) |

### 보조 컬러 — Blue (#0081CC)

> 메인 레드보다 절제해서 사용 (전체 3% 수준)

| 토큰 | HEX | RGB | 사용처 |
|---|---|---|---|
| `blue-50` | `#E6F2FA` | 230,242,250 | 정보 영역 배경 |
| `blue-100` | `#CCE5F5` | 204,229,245 | 호버 배경 |
| `blue-500` | `#0081CC` | 0,129,204 | **보조 - 카테고리 표시, 일부 아이콘** |
| `blue-600` | `#006BA8` | 0,107,168 | 보조 호버 |
| `blue-700` | `#005687` | 0,86,135 | 보조 텍스트 강조 |

### 베이스 컬러 (지도 톤과 조화)

| 토큰 | HEX | 사용처 |
|---|---|---|
| `white` | `#FFFFFF` | 메인 배경 |
| `cream-50` | `#FAF7F2` | 섹션 구분 배경 (지도 종이질감과 조화) |
| `cream-100` | `#F3EEE5` | 카드 배경, 푸터 (따뜻한 톤) |
| `gray-100` | `#F3F4F6` | 입력 필드, 보조 카드 |
| `gray-200` | `#E5E7EB` | 미세 구분선 (필요 시) |
| `gray-500` | `#6B7280` | 보조 텍스트 |
| `gray-700` | `#374151` | 본문 텍스트 |
| `gray-900` | `#111827` | 헤드라인, 제목 |

### 자연 보조 (일러스트 일치)

| 토큰 | HEX | 사용처 |
|---|---|---|
| `green-100` | `#E8EFE2` | 잔디 면 (옅음) |
| `green-300` | `#A8C193` | 잔디 면 (중간) |
| `green-500` | `#7FA968` | 자연 일러스트 메인 |

### 컬러 사용 비율

```
화이트·크림 70%
그레이      15%
레드        10%  (강조에만)
블루         3%  (절제)
그린·기타    2%  (일러스트 내)
```

### 컬러 사용 규칙

**레드 (`#EA2C38`)**
- ✅ CTA 버튼, 활성 메뉴, 기호 2번, D-Day 띠, 강조 키워드, 카운터 숫자
- ❌ 본문 텍스트, 큰 면 배경, 모든 버튼 통일 사용

**블루 (`#0081CC`)**
- ✅ 보도자료 카테고리 뱃지, SNS 아이콘 일부, 정보성 영역 배경 (옅은 톤)
- ❌ 메인 CTA 버튼, 큰 면 배경

**두 컬러 동시 사용**: 같은 시각 단위 안에서 함께 사용 금지. 분리된 영역에서 각자 역할 수행.

---

## ✍️ 타이포그래피

### 폰트 패밀리

```css
font-family: 'Pretendard Variable', Pretendard, -apple-system,
             BlinkMacSystemFont, system-ui, Roboto,
             "Helvetica Neue", "Segoe UI", sans-serif;
```

### CDN 로드

```html
<link rel="stylesheet" as="style" crossorigin
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
```

### 타이포 스케일

| 토큰 | 크기 | 굵기 | 사용처 |
|---|---|---|---|
| `display-1` | 64px / 4rem | 800 (ExtraBold) | 메인 히어로 슬로건 |
| `display-2` | 48px / 3rem | 800 | 페이지 헤드라인 |
| `heading-1` | 36px / 2.25rem | 700 (Bold) | 섹션 헤드라인 |
| `heading-2` | 28px / 1.75rem | 700 | 서브 섹션 |
| `heading-3` | 22px / 1.375rem | 600 (SemiBold) | 카드 제목 |
| `body-large` | 18px / 1.125rem | 500 (Medium) | 강조 본문 |
| `body` | 16px / 1rem | 400 (Regular) | 일반 본문 (최소 크기) |
| `body-small` | 14px / 0.875rem | 400 | 보조 텍스트 |
| `caption` | 13px / 0.8125rem | 500 | 날짜, 메타 정보 |

### 행간 (Line Height)

| 타입 | 값 |
|---|---|
| 헤드라인 | 1.2 |
| 본문 | 1.6 |
| 캡션 | 1.4 |

### 자간 (Letter Spacing)

| 타입 | 값 |
|---|---|
| 한글 헤드라인 | -0.02em |
| 한글 본문 | -0.01em |
| 숫자·영문 | 0 |

### 모바일 반응형 폰트

데스크톱 → 모바일 변환:
- `display-1`: 64px → 40px
- `display-2`: 48px → 32px
- `heading-1`: 36px → 28px
- `heading-2`: 28px → 22px
- `heading-3`: 22px → 18px
- 본문: 변함없음

---

## 📐 간격 시스템 (Spacing)

8px 그리드 기반.

| 토큰 | 크기 | 사용처 |
|---|---|---|
| `space-1` | 4px | 매우 좁은 간격 |
| `space-2` | 8px | 인라인 요소 |
| `space-3` | 12px | 작은 패딩 |
| `space-4` | 16px | 기본 패딩 |
| `space-6` | 24px | 카드 내부, 컴포넌트 간격 |
| `space-8` | 32px | 컴포넌트 그룹 |
| `space-12` | 48px | 섹션 내 큰 간격 |
| `space-16` | 64px | 섹션 사이 (모바일) |
| `space-20` | 80px | 섹션 사이 (태블릿) |
| `space-24` | 96px | 섹션 사이 (데스크톱) |
| `space-32` | 128px | 큰 섹션 사이 (데스크톱) |

### 섹션 간 간격

```
모바일:  64px (space-16)
태블릿:  80px (space-20)
데스크톱: 96px (space-24), 큰 섹션은 128px
```

### 컨테이너

```
모바일:    100% (16px 좌우 패딩)
태블릿:    100% (32px 좌우 패딩)
데스크톱:  최대 1200px (중앙 정렬, 양쪽 자동 여백)
```

---

## 🔲 모서리 둥글기 (Radius)

| 토큰 | 크기 | 사용처 |
|---|---|---|
| `radius-sm` | 6px | 태그, 작은 뱃지 |
| `radius-md` | 12px | 버튼, 입력 필드 |
| `radius-lg` | 16px | 카드, 이미지 |
| `radius-xl` | 20px | 작은 모달 |
| `radius-2xl` | 24px | 일반 모달 |
| `radius-3xl` | 28px | 큰 모달 |
| `radius-full` | 9999px | 원형 (프로필 등) |

**계층 원칙**: 모달 24px > 카드 16px > 입력/버튼 12px > 작은 요소 6~8px. 큰 컨테이너일수록 더 둥글게.

---

## 🌫️ 그림자 (Shadow)

> "공중에 떠 있는 듯한" 느낌이 아닌, "테이블에 살짝 놓인" 느낌

| 토큰 | 값 | 사용처 |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | 미세한 카드 |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | 일반 카드, 호버 |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.08)` | 강조 카드, 토스트 |
| `shadow-xl` | `0 16px 40px rgba(0,0,0,0.10)` | 떠오르는 인터랙션 |
| `shadow-modal` | `0 24px 64px rgba(0,0,0,0.16)` | 모달 |

---

## 🎬 모션 (Motion)

> 화려한 애니메이션 X. 작은 디테일로 신뢰감.

### 기본 이징

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* 자연스러운 감속 */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### 인터랙션 사양

| 인터랙션 | 사양 |
|---|---|
| 버튼 호버 | 0.2s ease-out, translateY(-2px) |
| 카드 호버 | 0.3s ease-out, 그림자 강화 + translateY(-4px) |
| 페이지 진입 | 0.4s fade-in + translateY(8px) |
| 스크롤 진입 | viewport 진입 시 fade-in (한 번만) |
| 모달 등장 | 0.3s, opacity 0→1, scale 0.96→1, translateY 16px→0 |
| 모달 퇴장 | 0.2s ease-out |

---

## 🎨 일러스트 시스템 (SVG)

### 톤앤매너

- **펠트와 클레이의 중간**: 부드러운 표면 + 살짝 거친 질감
- **미니어처 아이소메트릭**: 30도 등각 투영
- **컬러 절제**: 한 일러스트당 4~6색
- **모서리 둥글게**: 모든 형태에 둥근 모서리

### SVG 질감 표현 기법

```svg
<!-- 펠트 거칠기 (잔디·땅 표면) -->
<filter id="felt">
  <feTurbulence type="fractalNoise" baseFrequency="0.9"
                numOctaves="2" seed="3"/>
  <feColorMatrix values="0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 0 0
                         0 0 0 0.08 0"/>
  <feComposite in2="SourceGraphic" operator="in"/>
  <feMerge>
    <feMergeNode in="SourceGraphic"/>
    <feMergeNode/>
  </feMerge>
</filter>

<!-- 클레이 광택 (둥근 표면) -->
<radialGradient id="clay-light" cx="30%" cy="30%">
  <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
  <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
</radialGradient>

<!-- 부드러운 그림자 -->
<filter id="soft-shadow">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
  <feOffset dx="0" dy="4" result="offsetblur"/>
  <feComponentTransfer>
    <feFuncA type="linear" slope="0.08"/>
  </feComponentTransfer>
  <feMerge>
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### 일러스트 원칙

- 모서리 둥글게 (R4~R8px 수준)
- 직선보다 약간 휘어진 선
- 단순한 형태 + 핵심 디테일만
- 객체당 4~5색 이하
- 같은 색상의 명도 변화 그라데이션만 (다른 색끼리 X)
- 검정색 외곽선 ❌

---

## 🔣 아이콘 시스템

### UI 아이콘: Heroicons

```bash
npm install @heroicons/react
```

**사용**:
- 기본: Outline 스타일 (`@heroicons/react/24/outline`)
- 활성/강조: Solid 스타일 (`@heroicons/react/24/solid`)
- 작은 크기: Mini (`@heroicons/react/20/solid`)

**크기**: 16px / 20px / 24px

### SNS 아이콘

각 SNS 공식 컬러 유지, 모양·스타일은 통일된 솔리드 형태로 디자인.

| SNS | 컬러 | 형태 |
|---|---|---|
| 유튜브 | `#FF0000` | 통일된 솔리드 |
| 인스타그램 | `#E4405F` | 통일된 솔리드 |
| 페이스북 | `#1877F2` | 통일된 솔리드 |
| 네이버 블로그 | `#03C75A` | 통일된 솔리드 |

---

## 🧱 컴포넌트 라이브러리

### 버튼 (Button)

#### Primary Button (메인 CTA)
```tsx
<button className="
  px-6 py-3.5
  bg-[#EA2C38] hover:bg-[#D11F2A]
  text-white
  rounded-xl
  font-medium text-base
  transition-all duration-200 ease-out
  hover:-translate-y-0.5
  shadow-md hover:shadow-lg
">
  응원 한마디 남기기
</button>
```

#### Secondary Button (보조)
```tsx
<button className="
  px-6 py-3.5
  bg-white hover:bg-gray-50
  text-gray-900
  border-2 border-gray-200
  rounded-xl
  font-medium text-base
  transition-all duration-200 ease-out
">
  공약 보기
</button>
```

#### Text Button (인라인)
```tsx
<button className="
  text-[#EA2C38] hover:underline
  font-medium
  inline-flex items-center gap-1
">
  자세히 보기 →
</button>
```

### 카드 (Card)

```tsx
<div className="
  bg-white
  rounded-2xl
  shadow-md hover:shadow-lg
  p-6
  transition-all duration-300 ease-out
  hover:-translate-y-1
">
  {/* 카드 콘텐츠 */}
</div>
```

### 태그·뱃지

```tsx
{/* Red 뱃지 */}
<span className="
  inline-flex items-center
  px-2.5 py-1
  rounded-md
  bg-[#FDECEE] text-[#EA2C38]
  text-xs font-medium
">
  공약
</span>

{/* Blue 뱃지 */}
<span className="
  inline-flex items-center
  px-2.5 py-1
  rounded-md
  bg-[#E6F2FA] text-[#0081CC]
  text-xs font-medium
">
  정책
</span>
```

### 입력 필드

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-900">
    닉네임 <span className="text-[#EA2C38]">*</span>
  </label>
  <input
    type="text"
    className="
      w-full px-4 py-3.5
      bg-gray-50 focus:bg-white
      rounded-xl
      text-base text-gray-900
      placeholder-gray-500
      transition-all duration-200
      focus:outline-none focus:ring-4 focus:ring-[#EA2C38]/10
      focus:border-2 focus:border-[#EA2C38]
    "
    placeholder="osan_2026"
  />
  <p className="text-xs text-gray-500">
    영문 + 언더스코어(_) + 숫자, 4~20자
  </p>
</div>
```

### 모달 (기본)

```tsx
<div className="
  fixed inset-0 z-50
  bg-gray-900/45 backdrop-blur-md
  flex items-center justify-center
  p-4
  animate-fadeIn
">
  <div className="
    bg-white
    rounded-3xl
    shadow-2xl
    max-w-[560px] w-full
    p-8
    animate-modalIn
  ">
    {/* 모달 콘텐츠 */}
  </div>
</div>
```

---

## 📱 반응형 브레이크포인트

```js
// tailwind.config.js screens
{
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}
```

| 디바이스 | 크기 | 컨테이너 |
|---|---|---|
| 모바일 | < 768px | 100% (16px 패딩) |
| 태블릿 | 768~1023px | 100% (32px 패딩) |
| 데스크톱 | ≥ 1024px | 최대 1200px (중앙) |

### 모바일 우선 (Mobile First)

모든 컴포넌트는 모바일 기준으로 먼저 설계 → 큰 화면으로 확장.

---

## ♿ 접근성 (a11y)

| 항목 | 기준 |
|---|---|
| 최소 폰트 | 16px (어르신 유권자) |
| 컬러 대비 | WCAG AA (4.5:1 이상) |
| 키보드 네비 | 모든 인터랙티브 요소 |
| 포커스 인디케이터 | 2px `#EA2C38` outline |
| 이미지 alt 텍스트 | 의미 있는 모든 이미지 |
| 링크 명확성 | "여기 클릭" X, "공약 보기" O |
| ARIA 라벨 | 모달·버튼·폼 적절히 |
| 포커스 트랩 | 모달 안에서만 Tab |

---

## 🎨 레퍼런스 (Visual References)

### 비주얼 톤
- **국민의힘 사이트** (https://www.peoplepowerparty.kr/) — 컬러·구성 톤
- **Korean Minimalism**: 부드러운 중립 컬러 (cream, white, sage) 활용
- **Awwwards South Korea**: 깔끔한 그리드·여백 활용

### 아이소메트릭 일러스트 톤
- **Mohamed Chahin (Vintage living room)**: 둥근 모서리·부드러운 컬러
- **Mikael Eidenberg (Space Chase)**: 미니어처 도시 느낌
- 받은 `map.png` 자체가 가장 강력한 톤 기준점

### 펠트/클레이 톤
- Pinterest: "3D Clay Illustration" 검색 결과
- Dribbble: "3D Clay" 태그
- 받은 펠트 KTX 이미지

### 모달·UI 톤
- Linear (https://linear.app) — 부드러운 모달·인터랙션
- Vercel (https://vercel.com) — 깔끔한 폼·버튼
- Toss (https://toss.im) — 한글 친화적 레이아웃·여백

---

## 📦 추천 라이브러리

| 용도 | 라이브러리 |
|---|---|
| 프레임워크 | Next.js 14+ (App Router) |
| UI | React 18+ |
| 스타일 | TailwindCSS 3+ |
| 폰트 | Pretendard Variable (CDN) |
| 아이콘 | @heroicons/react |
| 애니메이션 | framer-motion |
| 토스트 | sonner |
| 모달 | Radix UI Dialog (`@radix-ui/react-dialog`) |
| 폼 | react-hook-form + zod |
| 리치 에디터 | @tiptap/react + @tiptap/starter-kit |
| 이미지 저장 | html-to-image |
| 캐러셀 | embla-carousel-react |
| DB·인증 | firebase 10+ |
| 분석 | gtag (GA4) |

---

## 🚫 사용 금지 라이브러리

- **shadcn/ui 전체 도입 X** (Radix + 커스텀 스타일로 충분)
- **Bootstrap, MUI** (디자인 톤 불일치)
- **차트.js 라이브러리 (chart.js, ApexCharts)** — 필요 시 Recharts만
- **Slick Carousel** — embla-carousel로 통일

---

**디자인 시스템 가이드 끝**
