# MOG Frontend 기여 가이드

MOG 프론트엔드에 기여할 때 필요한 로컬 실행, 브랜치, 커밋, 검증 규칙을 정리합니다.

## 개발 환경 준비

Node.js 20 이상과 npm을 사용합니다.

```bash
git clone https://github.com/goorm-mog/mog-frontend.git
cd mog-frontend
npm ci
cp .env.example .env
npm run dev
```

환경 변수와 MSW 설정은 [환경 설정 문서](docs/ENVIRONMENT.md)를 참고하세요.

## 작업 흐름

1. 최신 `develop`을 기준으로 작업 브랜치를 만듭니다.
2. Jira 티켓 범위에 맞춰 작고 검토 가능한 단위로 변경합니다.
3. API 변경이 있으면 타입과 MSW handler/fixture를 함께 갱신합니다.
4. 공통 UI 변경은 관련 Storybook story를 추가하거나 갱신합니다.
5. 로컬 검증을 통과한 뒤 `develop`을 대상으로 PR을 엽니다.

브랜치 이름은 팀에서 사용하는 Jira 티켓을 알아볼 수 있게 작성합니다.

```text
MOG-101/kakao-login
MOG-142/fix-settlement-total
```

## 커밋 메시지

Husky `commit-msg` hook이 다음 형식을 검사합니다.

```text
[MOG-숫자] 변경 내용
```

예시:

```text
[MOG-101] 카카오 로그인 오류 처리 추가
```

티켓 번호가 없는 문서·설정 작업도 현재 hook을 통과하려면 팀에서 발급한 작업 티켓 번호가
필요합니다.

## 코드 작성 기준

- TypeScript strict 설정과 `@/` 경로 별칭을 사용합니다.
- 컴포넌트는 화면 구성에 집중하고 네트워크/복잡한 상태 로직은 API 함수와 hook으로 분리합니다.
- 페이지 전용 코드는 `src/pages/<PageName>` 아래에 둡니다.
- 재사용 가능한 도메인 코드는 `src/features/<domain>`에 둡니다.
- 공통 컴포넌트는 기존 색상·타이포그래피 토큰을 우선 사용합니다.
- 포맷은 `.prettierrc`의 2칸 들여쓰기, single quote, semicolon, trailing comma 규칙을 따릅니다.
- 인증 토큰, API key, 개인 `.env` 파일은 커밋하지 않습니다.

자세한 배치 기준은 [아키텍처 문서](docs/ARCHITECTURE.md)를 참고하세요.

## 로컬 검증

PR 전에 최소한 다음 명령을 실행합니다.

```bash
npm run lint
npm test
npm run build
```

UI를 변경했다면 Storybook에서 기본/로딩/빈 상태/오류/disabled 등 영향을 받는 상태를 확인합니다.

```bash
npm run storybook
```

`pre-commit` hook도 `npm test`를 실행합니다. 브라우저 테스트에 필요한 Chromium이 없다면 다음
명령으로 설치합니다.

```bash
npx playwright install chromium
```

## PR 작성

PR은 가능한 한 하나의 티켓과 목적만 포함합니다. `.github/PULL_REQUEST_TEMPLATE.md`의 항목을
작성하고 다음 내용을 명확히 남겨 주세요.

- 사용자가 체감하는 변경사항
- 주요 구현 내용과 설계 판단
- API, 환경 변수, 패키지, storage schema 등 협업 영향
- 실행한 검증과 결과
- UI 변경 전후 스크린샷 또는 영상
- 남은 작업이나 알려진 제한사항

GitHub Actions는 lint, test, type check, build를 수행합니다. Storybook 변경은 Chromatic 결과도
확인합니다.

## 리뷰 체크리스트

- 방장/참여자 역할에 따른 화면과 권한이 모두 맞는가?
- 로딩, 빈 데이터, 오류, 중복 제출 상태가 처리됐는가?
- 모바일 너비와 safe-area에서 레이아웃이 유지되는가?
- 새 API가 `ApiError`, 인증 만료, 404 정책을 일관되게 따르는가?
- 실시간 연결이 unmount 시 해제되는가?
- 접근 가능한 label, focus, keyboard 동작이 제공되는가?
- 민감 정보나 실제 사용자 데이터가 fixture/log에 포함되지 않았는가?

## 문서 변경

코드와 문서가 어긋나지 않도록 아래 변경 시 관련 문서도 함께 수정합니다.

| 변경                                   | 함께 확인할 문서                      |
| -------------------------------------- | ------------------------------------- |
| 실행 명령, 기술 스택, 주요 기능        | `README.md`                           |
| 환경 변수, API/프록시/카카오 설정      | `docs/ENVIRONMENT.md`, `.env.example` |
| 디렉터리 경계, 인증·라우팅·실시간 흐름 | `docs/ARCHITECTURE.md`                |
| 브랜치, 커밋, 테스트, PR 정책          | `CONTRIBUTING.md`, PR 템플릿          |
