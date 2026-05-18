# Claude Code 마스터 프롬프트

> 이 파일의 내용을 **Claude Code의 첫 메시지**로 전달하세요.
> 그 다음 함께 제공된 4개 .md 파일을 첨부합니다.

---

## 🎯 프로젝트 시작 프롬프트 (복사해서 사용)

```
안녕하세요. 이권재 더큰오산 캠프 후보자 홍보 홈페이지를 개발할 예정입니다.

## 프로젝트 개요
- 6.3 오산시장 선거 후보자(기호 2번 · 국민의힘 · 이권재) 공식 홍보 사이트
- 도메인: 이권재.com
- 기술 스택: Next.js 14+ App Router, TypeScript, TailwindCSS, Firebase
- 호스팅: Vercel

## 첨부 문서 (반드시 읽고 작업 시작)
1. `01_design_system.md` — 디자인 철학·시스템·컬러·타이포 (절대 위배 금지)
2. `02_tailwind_config.md` — 코드 토큰·tailwind.config·globals.css
3. `03_page_structures.md` — 페이지별 상세 명세·실제 콘텐츠·Firebase 구조
4. `04_master_prompt.md` — 이 문서

## 작업 원칙 (절대 준수)
1. **디자인 시스템 절대 위배 금지**
   - 컬러: #EA2C38 (red 메인), #0081CC (blue 보조), cream/gray 베이스
   - 폰트: Pretendard Variable
   - 영문 장식 텍스트 절대 사용 X (ABOUT, VISION 등)
   - 라인보다 면으로 구분 (배경 톤 변화로 섹션 구분)
   - 형광 컬러·다크모드·과한 애니메이션 X

2. **콘텐츠는 03_page_structures.md의 실제 데이터 그대로**
   - 임의 변경·요약·축약 X
   - 슬로건: "시민과 함께 더 큰 오산으로!" (메인) / "검증된 성과, 일 잘하는 시장" (태깅)
   - 30개 성과·10개 핵심공약·8개 동별 공약 모두 정확히 반영

3. **모바일 우선 반응형**
   - 모바일 → 태블릿 → 데스크톱 순으로 설계
   - 최소 폰트 16px (어르신 유권자)
   - 모달은 모바일에서 Bottom Sheet (폼만)

4. **접근성**
   - WCAG AA 컬러 대비
   - 키보드 네비 모든 인터랙티브 요소
   - 한글 word-break: keep-all

5. **Phase 분리 개발**
   - Phase 1: 게임 외 모든 영역 + 히어로는 인터랙티브 지도(map.png)
   - Phase 2 (나중): 28칸 부르마블 게임 모듈로 히어로 교체
   - 히어로는 `<DiceGame />` 같은 독립 컴포넌트로 추상화해서 나중에 교체 용이하게

## 첫 번째 작업 요청
Next.js 프로젝트 초기 셋업과 디자인 시스템 적용을 부탁드립니다.

다음 순서로 진행해주세요:

### Step 1: 프로젝트 셋업
- Next.js 14 App Router 프로젝트 생성
- TypeScript, TailwindCSS, ESLint 설정
- 02_tailwind_config.md의 tailwind.config.ts·globals.css 적용
- package.json에 명시된 의존성 설치

### Step 2: 기본 레이아웃
- src/app/layout.tsx에 D-Day 띠 + 헤더 + 푸터 적용
- 03_page_structures.md의 공통 레이아웃 섹션 참조
- 헤더는 sticky, D-Day 띠는 자동 계산
- 캠프 로고 placeholder (실제 파일은 추후 추가)

### Step 3: 컴포넌트 라이브러리 기초
- src/components/ui/ 디렉토리에 재사용 컴포넌트
  - Button (Primary, Secondary, Text)
  - Card
  - Tag (Red, Blue)
  - Input, Textarea
  - Modal (Radix Dialog 기반)
  - Tabs (Radix Tabs 기반)
- 모든 컴포넌트는 디자인 시스템 토큰 사용 (하드코딩 X)

### Step 4: 홈 페이지 골격
- src/app/page.tsx에 7개 섹션 골격 생성
- 각 섹션은 별도 컴포넌트로 분리: HeroSection, MarqueeSection 등
- 실제 콘텐츠 들어가는 자리는 placeholder + 주석으로 표시
- 데이터는 일단 mock으로 (Firebase 연동은 별도 단계)

이 4단계만 먼저 진행하고, 각 단계 끝날 때마다 결과 보여주세요.
디자인 시스템 위배 사항이 발견되면 즉시 알려주시고 함께 조정합시다.

이후 단계는 단계별로 추가 요청드리겠습니다.

준비되셨다면 첨부 문서들을 읽고 Step 1부터 시작해주세요.
```

---

## 📋 단계별 후속 요청 템플릿

위 첫 메시지로 기본 셋업이 끝나면, 다음 작업을 단계별로 요청하세요.

### Step 5: 홈페이지 콘텐츠 채우기

```
홈페이지 7개 섹션을 03_page_structures.md의 명세대로 완성해주세요.

순서:
1. 히어로 (map.png는 /public/images/map.png 사용, 일단 인터랙션 없이 정적)
2. 응원 marquee (mock 데이터 10개로 양방향 흐름 구현)
3. SNS 미리보기 (유튜브·인스타 mock 카드 각 4개)
4. 성과/공약 미리보기 (캐러셀 + 자동 슬라이드, mock 카드 각 7개)
5. 보도자료 미리보기 (mock 카드 4개)
6. 클로징 (후보 사진 placeholder + 슬로건 + CTA)

각 섹션은:
- 03_page_structures.md의 텍스트·구조 그대로
- 반응형 (모바일·태블릿·데스크톱)
- 페이지 진입 시 stagger 애니메이션 (framer-motion)
- 컴포넌트 분리: src/components/sections/

embla-carousel-react로 캐러셀 구현.
marquee는 CSS 키프레임으로 구현 (이미 globals.css에 정의됨).
```

### Step 6: 서브 페이지

```
서브 페이지 5개를 03_page_structures.md 명세대로 만들어주세요.

순서:
1. /about - 후보자 소개 (인사말 본문은 명세서의 실제 텍스트 그대로)
2. /achievements - 성과 30개 그리드 + 모달
3. /pledges - 4개 탭 (Radix Tabs)
   - 핵심공약 10개 (실제 데이터)
   - 분야별 (4대 일꾼 분류)
   - 동별 (지도 + 8개 동, 실제 사업 리스트)
   - 내게 맞는 (3단계 설문 + 결과)
4. /press - 보도자료 목록 + /press/[id] 상세
5. /cheers - 응원한마디 + 작성 모달

각 페이지의 텍스트는 명세서 그대로.
공약·성과·동별 사업 데이터는 명세서의 TypeScript 객체를 그대로 사용.
```

### Step 7: 모달·폼·인터랙션

```
공통 컴포넌트와 인터랙션을 완성해주세요.

1. 응원 작성 모달
   - Radix Dialog 기반
   - 데스크톱: 일반 모달 / 모바일: Bottom Sheet
   - react-hook-form + zod 검증
   - 닉네임 정규식, 금지어 필터
   - 동의 체크박스 (펼치기/접기)

2. 신고 모달 (작은 모달, 라디오)

3. 카드 상세 모달 (성과·공약·히어로 지도)

4. 토스트 (sonner)
   - 응원 등록 성공 등

5. 내게 맞는 공약 설문
   - 3단계 진행바
   - 카드형 라디오/체크박스
   - 결과 페이지 + 이미지 저장 (html-to-image)

모든 모달은 키보드(ESC) 닫기 + 포커스 트랩.
```

### Step 8: Firebase 연동

```
Firebase 연동을 진행해주세요.

1. Firebase 셋업
   - src/lib/firebase.ts (초기화)
   - 환경 변수 (.env.local 템플릿)
   - Firestore·Storage·Auth 활성화

2. 응원 시스템
   - 작성 → Firestore 저장
   - 메인페이지·응원페이지 실시간 표시 (onSnapshot)
   - 카운터 실시간

3. 보도자료
   - 목록 페이지 SSG → ISR
   - 상세 페이지 동적 라우트

4. SNS 인스타 큐레이션
   - Firestore에서 가져오기

5. 성과·공약 카드
   - Firestore에서 가져오기 (또는 정적 데이터 우선)

6. YouTube Data API
   - 채널 @with5340 최신 영상 4개
   - src/lib/youtube.ts

데이터 패칭은 가능한 한 서버 컴포넌트로.
실시간 필요한 부분만 클라이언트 컴포넌트.
```

### Step 9: 관리자 페이지

```
관리자 페이지를 만들어주세요.

- /admin/login - Firebase Auth 이메일·비번
- /admin (대시보드) - 통계 카드
- /admin/cheers - 응원 관리 (삭제·차단)
- /admin/press - 보도자료 CRUD (Tiptap 에디터)
- /admin/sns - 인스타 큐레이션
- /admin/cards - 성과·공약 카드 관리
- /admin/settings - 금지어·운영자

미들웨어로 /admin 라우트 인증 보호.
admin 페이지는 메인 사이트와 시각적으로 분리된 백오피스 디자인.
```

### Step 10: SEO·접근성·성능

```
프로덕션 최적화를 진행해주세요.

1. SEO
   - 모든 페이지 메타데이터 (Next.js generateMetadata)
   - Open Graph 이미지·태그
   - sitemap.xml, robots.txt
   - 카카오톡 공유 메타 최적화

2. 접근성
   - 모든 인터랙티브 요소 키보드 접근
   - aria-label 점검
   - 컬러 대비 검증

3. 성능
   - Lighthouse 점검
   - 이미지 최적화 (next/image)
   - 폰트 최적화
   - 코드 스플리팅 확인

4. 분석
   - Google Analytics 4 연동
   - 쿠키 동의 배너

5. 에러 페이지
   - 404, 500 디자인
```

---

## ⚠️ Claude Code에 자주 강조해야 할 것

이 프로젝트 작업 중 Claude Code가 디자인 시스템을 어길 수 있는 부분이 있어 미리 알려주세요:

```
다음 사항을 절대 어기지 마세요:

1. 영문 장식 텍스트 절대 X
   - "ABOUT", "OUR VISION", "GET IN TOUCH" 같은 영문 소제목 만들지 마세요
   - 모든 헤드라인·서브 카피는 한글

2. 컬러는 디자인 토큰만
   - 임의 색상 코드 사용 금지
   - 모든 컬러는 tailwind config의 토큰 사용
   - "보기 좋아서" 다른 색 추가하지 마세요

3. 폰트는 Pretendard만
   - 다른 영문 폰트 (Inter, Roboto 등) 임의 추가 금지
   - 특히 Electrolize, Orbitron 같은 테크 폰트 절대 X

4. 라인 디자인 지양
   - 모든 영역에 border 추가하지 마세요
   - 섹션 구분은 배경 톤 변화로
   - 꼭 필요한 곳에만 옅은 1px 라인

5. 의미 없는 장식 그래픽 X
   - 화면 채우려고 추상 도형·패턴 만들지 마세요
   - 그라데이션 배경 임의 추가 X

6. 콘텐츠 임의 작성 X
   - 슬로건·공약·성과 내용은 명세서대로
   - "더 자연스럽게 하려고" 텍스트 바꾸지 마세요
   - 추가가 필요하면 먼저 물어보세요

7. 라이브러리 임의 추가 X
   - shadcn/ui, MUI, Bootstrap 임의 추가 금지
   - 명세서의 라이브러리 리스트 외 추가 시 먼저 상의

8. 한글 줄바꿈 처리
   - word-break: keep-all 적용
   - 한글이 어색하게 잘리지 않게
```

---

## 🎨 디자인 검증 체크리스트

각 단계 끝낼 때마다 다음을 확인하세요:

- [ ] 컬러는 디자인 토큰만 사용했는가?
- [ ] 영문 장식 텍스트가 없는가?
- [ ] 폰트는 Pretendard인가?
- [ ] 모바일에서 가독성·터치 영역 충분한가?
- [ ] 키보드만으로 모든 기능 사용 가능한가?
- [ ] 형광·과한 컬러가 없는가?
- [ ] 의미 없는 장식 그래픽이 없는가?
- [ ] 섹션 구분이 라인 아닌 면으로 되어있는가?
- [ ] 부드러운 둥근 모서리(12~24px) 적용했는가?
- [ ] 그림자가 옅고 자연스러운가?

---

## 🚀 시작하기

1. 위의 "프로젝트 시작 프롬프트"를 Claude Code의 첫 메시지로 복사
2. 4개 .md 파일을 함께 첨부
3. Claude Code가 문서를 읽고 Step 1부터 시작
4. 단계가 끝날 때마다 결과 확인 → 다음 Step 요청
5. 디자인 시스템 위배 발견 시 즉시 지적

---

**Claude Code 마스터 프롬프트 끝**
