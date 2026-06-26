import { ChevronDown } from 'lucide-react';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type PayerSelectProps = {
  payerText: string;
};

function PayerSelect({ payerText }: PayerSelectProps) {
  return (
    <div
      className="flex h-10 items-center justify-between border-b px-3"
      style={{ borderColor: colors.darkBorder }}
    >
      <span className={typography.caption} style={{ color: colors.border }}>
        {payerText}
      </span>
      <ChevronDown className="size-6" strokeWidth={2.5} color={colors.text} />
    </div>
  );
}

export default PayerSelect;
