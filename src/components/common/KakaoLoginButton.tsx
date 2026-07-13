import { cn } from '@/lib/utils';

const KAKAO_LOGIN_BUTTON_SRC = '/assets/kakao/kakao_login_medium_wide.png';
const KAKAO_LOGIN_BUTTON_SRC_2X = '/assets/kakao/kakao_login_large_wide.png';

type KakaoLoginButtonProps = {
  onClick?: () => void;
  className?: string;
};

function KakaoLoginButton({ onClick, className }: KakaoLoginButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="카카오 로그인"
      className={cn('w-full border-0 bg-transparent p-0', className)}
    >
      <img
        src={KAKAO_LOGIN_BUTTON_SRC}
        srcSet={`${KAKAO_LOGIN_BUTTON_SRC} 1x, ${KAKAO_LOGIN_BUTTON_SRC_2X} 2x`}
        alt="카카오 로그인"
        className="h-auto w-full"
        draggable={false}
      />
    </button>
  );
}

export default KakaoLoginButton;
