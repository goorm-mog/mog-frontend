# 환경 설정

## 환경 변수

Vite는 `VITE_` 접두사가 붙은 값을 클라이언트 번들에 포함합니다. 따라서 아래 변수에는 서버
비밀키나 민감한 credential을 넣으면 안 됩니다.

| 변수                      | 필수 조건                  | 설명                                                          | 예시                      |
| ------------------------- | -------------------------- | ------------------------------------------------------------- | ------------------------- |
| `VITE_API_BASE_URL`       | 실제 API 사용 시 권장      | REST/SSE 요청의 기준 URL. 비워 두면 현재 origin 사용          | `https://api.example.com` |
| `VITE_WS_BASE_URL`        | 선택                       | 채팅 WebSocket origin. 없으면 API URL에서 `ws(s)` 주소를 유도 | `wss://api.example.com`   |
| `VITE_KAKAO_REST_API_KEY` | 실제 카카오 로그인 시 필수 | 카카오 OAuth의 JavaScript 노출 가능 REST API 키               | `your-rest-api-key`       |
| `VITE_KAKAO_MAP_KEY`      | 지도 화면 사용 시 필수     | Kakao Maps JavaScript SDK 앱 키                               | `your-javascript-key`     |
| `VITE_MSW_ENABLED`        | 선택                       | `true`이면 브라우저에서 MSW API 모킹 활성화                   | `true`                    |

기본 파일을 복사해 로컬 설정을 만듭니다.

```bash
cp .env.example .env
```

`.env`는 `.gitignore`에 포함되어 있습니다. 키가 입력된 파일은 커밋하지 마세요.

## 실행 프로필

### 로컬 UI 개발 (MSW)

```dotenv
VITE_API_BASE_URL=
VITE_WS_BASE_URL=
VITE_KAKAO_REST_API_KEY=
VITE_KAKAO_MAP_KEY=your-kakao-javascript-key
VITE_MSW_ENABLED=true
```

카카오 로그인 버튼은 mock 로그인으로 동작합니다. REST API와 채팅 전송도 MSW handler가
처리합니다. 단, Kakao Maps SDK를 사용하는 출발지·중간 지점 화면에는 지도 키가 필요합니다.

### 로컬 프론트엔드 + 개발 API

`vite.config.ts`에는 `/api` 요청을 개발 API 서버로 전달하는 프록시가 구성되어 있습니다.
같은-origin 프록시를 사용하려면 API base를 비워 둡니다.

```dotenv
VITE_API_BASE_URL=
VITE_WS_BASE_URL=wss://your-development-api.example.com
VITE_KAKAO_REST_API_KEY=your-kakao-rest-api-key
VITE_KAKAO_MAP_KEY=your-kakao-javascript-key
VITE_MSW_ENABLED=false
```

프록시의 기본 target은 `vite.config.ts`에서 관리합니다. 다른 백엔드에 직접 연결해야 한다면
`VITE_API_BASE_URL`에 전체 origin을 설정할 수 있습니다. 이 경우 백엔드 CORS와 credential 허용
설정이 필요합니다.

### 배포 환경

```dotenv
VITE_API_BASE_URL=https://api.example.com
VITE_WS_BASE_URL=wss://api.example.com
VITE_KAKAO_REST_API_KEY=your-kakao-rest-api-key
VITE_KAKAO_MAP_KEY=your-kakao-javascript-key
VITE_MSW_ENABLED=false
```

배포 시 다음도 함께 확인하세요.

- SPA 라우트가 `index.html`로 fallback되는지
- 서비스 origin이 카카오 앱의 Redirect URI 및 JavaScript SDK 허용 도메인에 등록됐는지
- `/oauth/kakao`가 정확한 Redirect URI로 등록됐는지
- REST API가 프론트엔드 origin의 credential 요청을 허용하는지
- WebSocket과 SSE 연결이 reverse proxy에서 buffering 없이 유지되는지
- Web Share API를 사용할 화면이 HTTPS로 제공되는지

## 카카오 설정

로그인 Redirect URI는 런타임 origin을 기준으로 자동 생성됩니다.

```text
{window.location.origin}/oauth/kakao
```

개발과 운영 origin 각각을 카카오 개발자 콘솔에 등록해야 합니다. 지도에는 REST API 키가 아니라
Kakao Maps JavaScript 키를 사용합니다.

## API 및 WebSocket 주소 계산

- REST: `${VITE_API_BASE_URL}${path}`
- SSE: `${VITE_API_BASE_URL}/api/v1/notifications/subscribe`
- WebSocket: `${VITE_WS_BASE_URL}/ws-stomp`

`VITE_WS_BASE_URL`이 없으면 `VITE_API_BASE_URL`의 protocol을 `http → ws`, `https → wss`로
변환합니다. API base도 비어 있으면 현재 페이지의 host를 사용합니다.

## 문제 해결

### `카카오 REST API 키가 설정되지 않았습니다`

`VITE_KAKAO_REST_API_KEY`를 입력하고 개발 서버를 다시 시작하세요. Vite 환경 변수는 서버 시작
시 로드됩니다.

### 지도가 나타나지 않음

`VITE_KAKAO_MAP_KEY`가 JavaScript 키인지, 현재 origin이 카카오 앱의 허용 도메인에 등록됐는지
확인하세요.

### API 요청이 MSW와 실제 서버에 섞여 전달됨

`VITE_MSW_ENABLED`는 문자열 `true`일 때만 활성화됩니다. 값을 바꾼 후 개발 서버를 재시작하고,
브라우저 DevTools에서 `mockServiceWorker.js`가 등록됐는지 확인하세요.

### 채팅 연결 실패

WebSocket base가 REST base와 다르면 `VITE_WS_BASE_URL`을 명시하세요. URL에는 `/ws-stomp`를
붙이지 않고 origin만 입력합니다.

### 새로고침 시 404

이 앱은 `BrowserRouter` 기반 SPA입니다. 호스팅 서버가 모든 앱 경로를 `/index.html`로 보내도록
fallback 규칙을 설정해야 합니다.
