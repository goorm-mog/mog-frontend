const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize';

export function getKakaoRedirectUri() {
  return `${window.location.origin}/oauth/kakao`;
}

export function redirectToKakaoLogin() {
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY;

  if (!clientId) {
    throw new Error('카카오 REST API 키가 설정되지 않았습니다.');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getKakaoRedirectUri(),
    response_type: 'code',
  });

  window.location.href = `${KAKAO_AUTH_URL}?${params.toString()}`;
}
