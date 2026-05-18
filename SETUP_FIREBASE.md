# Firebase 운영 가이드

## 1. 보안 규칙 게시

이 저장소의 [firestore.rules](./firestore.rules), [storage.rules](./storage.rules) 내용을 콘솔에 그대로 붙여넣고 게시합니다.

1. https://console.firebase.google.com → `thebigosan` 프로젝트
2. **Firestore Database → 규칙** 탭 → [firestore.rules](./firestore.rules) 전체 내용 복붙 → **게시**
3. **Storage → 규칙** 탭 → [storage.rules](./storage.rules) 전체 내용 복붙 → **게시**

## 2. 운영자 권한

규칙은 이메일 화이트리스트 방식입니다 (`firestore.rules` 안 `adminEmails()` 함수). **추가 작업이 필요 없습니다** — Firebase Auth에 운영자 이메일로 계정만 등록하면 끝.

### 현재 운영자
- `greatosan100@gmail.com`

### 운영자 추가/변경 절차
1. `firestore.rules`와 `storage.rules`의 `adminEmails()` 배열에 이메일 추가
2. 콘솔 → Firestore Database → 규칙 / Storage → 규칙에 다시 게시
3. Firebase Auth → 사용자에 새 이메일 추가

> 안전장치: `request.auth.token.email_verified == true` 체크가 들어 있어, 이메일 확인이 안 된 계정은 통과하지 못합니다. Firebase Auth가 이메일/비밀번호로 만든 사용자도 가입 즉시 verified로 표시되니, 신뢰할 수 있는 운영자에게만 비밀번호를 공유하세요.

## 3. (선택) 초기 시드 데이터

코드가 Firestore 빈 상태일 때 mock 데이터로 fallback 합니다. 시드 없이도 사이트가 정상 동작하며, 보도자료/SNS 큐레이션은 Step 9 관리자 페이지에서 추가합니다.

## 4. 환경 변수

- 로컬: [.env.local](./.env.local) (커밋되지 않음)
- Vercel: 프로젝트 대시보드 → Settings → Environment Variables에 동일하게 등록되어 있음

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
