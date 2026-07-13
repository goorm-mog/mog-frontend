import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithKakaoCode } from '@/api/auth';
import { useToast } from '@/hooks/useToast';

function KakaoOAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) return;
    hasHandledRef.current = true;

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      showToast('카카오 로그인이 취소되었습니다.');
      navigate('/login', { replace: true });
      return;
    }

    if (!code) {
      showToast('인증 코드가 없습니다.');
      navigate('/login', { replace: true });
      return;
    }

    loginWithKakaoCode(code)
      .then(() => {
        navigate('/home', { replace: true });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : '카카오 로그인에 실패했습니다.';
        showToast(message);
        navigate('/login', { replace: true });
      });
  }, [navigate, searchParams, showToast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <p className="text-body text-text">로그인 처리 중...</p>
    </div>
  );
}

export default KakaoOAuthCallbackPage;
