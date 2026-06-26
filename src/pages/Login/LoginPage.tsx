import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithKakao } from '@/api/auth';
import DividerWithStar from '@/components/common/DividerWithStar';
import DividerWithText from '@/components/common/DividerWithText';
import KakaoLoginButton from '@/components/common/KakaoLoginButton';
import ParticipationCodeInput from '@/components/common/ParticipationCodeInput';
import TicketBorder from '@/components/common/TicketBorder';

function LoginPage() {
  const navigate = useNavigate();
  const [participationCode, setParticipationCode] = useState('');

  const handleKakaoLogin = async () => {
    // TODO: 카카오 로그인 연동
    await loginWithKakao();
    navigate('/home');
  };

  return (
    <div className="relative min-h-screen bg-background p-6 shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
      <TicketBorder contentClassName="items-center gap-[112px]">
        <header className="flex w-full flex-col gap-6 pt-6">
          <h1 className="text-logo text-center text-text">MOG</h1>
          <DividerWithStar />
          <p className="text-caption text-center text-text/70">
            약속 잡기부터 만남 기록·정산·추억 카드까지
          </p>
        </header>

        <section className="flex w-full flex-col gap-12 px-4">
          <KakaoLoginButton onClick={handleKakaoLogin} />
          <DividerWithText text="또는" />

          <div className="flex w-full flex-col gap-5">
            <p className="text-caption text-center font-semibold text-text">참여코드 입력</p>
            <ParticipationCodeInput
              value={participationCode}
              onChange={setParticipationCode}
            />
          </div>
        </section>

        <footer className="flex w-full flex-col items-center gap-[29px] pb-[19px]">
          <div className="h-[33px] w-full border-t border-dashed border-background" />
          <p className="text-caption text-center text-text/40">링크로 초대받으셨나요?</p>
        </footer>
      </TicketBorder>
    </div>
  );
}

export default LoginPage;
