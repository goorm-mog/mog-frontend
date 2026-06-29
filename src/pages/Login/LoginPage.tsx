import { useNavigate } from 'react-router-dom';
import { loginWithKakao } from '@/api/auth';
import DividerWithStar from '@/components/common/DividerWithStar';
import KakaoLoginButton from '@/components/common/KakaoLoginButton';
import TicketBorder from '@/components/common/TicketBorder';

function LoginPage() {
  const navigate = useNavigate();

  const handleKakaoLogin = async () => {
    // TODO: 카카오 로그인 연동
    await loginWithKakao();
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen bg-background p-6 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
      <TicketBorder contentClassName="items-center gap-28 pt-20 pb-24">
        <header className="flex w-full flex-col items-center gap-6">
          <h1 className="text-logo text-center text-text">MOG</h1>
          <DividerWithStar />
          <p className="text-caption text-center text-text/70">
            약속 잡기부터 만남 기록·정산·추억 카드까지
          </p>
        </header>

        <section className="mt-16 w-full px-4">
          <KakaoLoginButton onClick={handleKakaoLogin} />
        </section>
      </TicketBorder>
    </div>
  );
}

export default LoginPage;
