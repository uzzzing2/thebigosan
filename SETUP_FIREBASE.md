# Firebase 운영 가이드

## 1. 보안 규칙 배포

Firebase 콘솔에서 직접 붙여넣거나, firebase-tools(CLI)로 배포할 수 있습니다.

### A) 콘솔에서 붙여넣기 (가장 빠름)

1. https://console.firebase.google.com → `thebigosan` 프로젝트
2. **Firestore Database → 규칙** 탭 → 이 저장소의 [firestore.rules](./firestore.rules) 내용으로 교체 → **게시**
3. **Storage → 규칙** 탭 → [storage.rules](./storage.rules) 내용으로 교체 → **게시**

### B) CLI로 배포 (선택)

```bash
npm i -g firebase-tools
firebase login
firebase use thebigosan
firebase deploy --only firestore:rules,storage
```

## 2. 운영자 권한 부여 (Custom Claims)

Firestore 규칙은 `request.auth.token.admin == true` 인 사용자만 쓰기를 허용합니다.
이메일/비밀번호로 만든 사용자에게 `admin` claim을 부여해야 합니다.

### 가장 빠른 방법 — Google Cloud Shell

1. https://console.cloud.google.com 접속 → 우측 상단 **Cloud Shell 활성화** (>_ 아이콘)
2. 아래 명령 실행 (이메일은 운영자 본인 이메일로):

```bash
gcloud config set project thebigosan
gcloud auth application-default login
node -e "
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'thebigosan' });
admin.auth().getUserByEmail('greatosan100@gmail.com').then(u =>
  admin.auth().setCustomUserClaims(u.uid, { admin: true })
).then(() => console.log('OK')).catch(console.error);
"
```

(이 방법이 번거로우면, Step 9의 관리자 페이지에서 셋업 후 `/admin/setup` 같은 1회용 라우트로 처리해도 됩니다.)

권한 부여 후, 운영자는 **로그아웃 → 재로그인**해야 새 claim이 적용됩니다.

## 3. (선택) 초기 시드 데이터

코드가 Firestore가 비어 있을 땐 mock 데이터로 자동 fallback 됩니다. 그러므로 시드 없이도 사이트는 정상 동작합니다.

- 응원: 시민이 작성하면 자동으로 채워짐
- 보도자료: Step 9 관리자 페이지에서 작성
- SNS 큐레이션: Step 9 관리자 페이지에서 추가
- 성과 / 공약: 코드에 정적으로 들어가 있음 ([src/lib/data/](./src/lib/data/))

## 4. 환경 변수

- 로컬: [.env.local](./.env.local) (커밋되지 않음)
- Vercel: 프로젝트 대시보드 → Settings → Environment Variables 에 동일하게 등록
  - `NEXT_PUBLIC_FIREBASE_*` 7개
  - `NEXT_PUBLIC_GA_ID`
  - `ADMIN_EMAILS`

## 5. 자주 보는 컬렉션 구조

```
firestore/
├── cheers/{id}        # nickname, content, createdAt, reports, isHidden, fromGame
├── reports/{id}       # cheerId, reason, createdAt, processed
├── press/{id}         # category, title, body, thumbnail, publishedAt, mediaLinks, isPublished
├── snsCuration/{id}   # imageUrl, caption, originalUrl, postedAt, order, isActive
├── achievements/{id}  # imageUrl, importance, showOnMain, relatedLinks
├── pledges/{id}       # imageUrl, type, categoryTag, districtTag, ageTag, importance, showOnMain
└── settings/{id}      # bannedWords, bannedNicknames, bannedIps
```
