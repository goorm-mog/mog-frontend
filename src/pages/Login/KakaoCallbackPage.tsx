import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginWithKakaoCode } from '@/api/auth';
import TicketBorder from '@/components/common/TicketBorder';

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [message, setMessage] = useState('로그인 처리 중입니다.');

  useEffect(() => {
    if (!code) return;

    loginWithKakaoCode(code)
      .then(() => navigate('/home', { replace: true }))
      .catch(() => setMessage('카카오 로그인에 실패했습니다.'));
  }, [code, navigate]);

  const displayMessage = code ? message : '카카오 인가코드를 찾을 수 없습니다.';

  return (
    <div className="relative min-h-screen bg-background p-6 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
      <TicketBorder contentClassName="items-center justify-center px-6 py-24">
        <p className="text-body text-center text-text">{displayMessage}</p>
      </TicketBorder>
    </div>
  );
}

export default KakaoCallbackPage;
