export const typography = {
  logo: 'font-noto-serif font-black text-[80px] leading-[115px] tracking-[-0.02em]',
  head1: 'font-noto-serif font-bold text-[30px] leading-[43px] tracking-[-0.02em]',
  head2: 'font-pretendard font-semibold text-[24px] leading-[29px] tracking-[-0.02em]',
  body: 'font-pretendard font-semibold text-[16px] leading-[19px] tracking-[-0.02em]',
  caption: 'font-pretendard font-normal text-[14px] leading-[17px] tracking-[-0.02em]',
  body2: 'font-dm-mono font-medium text-[14px] leading-[18px] tracking-[-0.02em]',
} as const;

export type TypographyKey = keyof typeof typography;
