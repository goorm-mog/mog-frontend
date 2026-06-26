import { Plus, X } from 'lucide-react';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

type PhotoPickerProps = {
  photoCount: number;
  receiptId: string;
};

function PhotoPicker({ photoCount, receiptId }: PhotoPickerProps) {
  return (
    <div className="px-2">
      <div className="flex items-center justify-between">
        <h3 className={typography.body} style={{ color: colors.text }}>
          사진 선택
        </h3>
        <p className={typography.caption} style={{ color: colors.border }}>
          최대 5장
        </p>
      </div>

      <div className="mt-5 flex gap-4 overflow-x-auto pb-1 pt-2 promise-scrollbar-hidden">
        <button
          type="button"
          className="grid h-[60px] w-[72px] shrink-0 place-items-center rounded-[5px] border"
          style={{
            borderColor: colors.border,
            backgroundColor: colors.darkBackground,
            color: colors.border,
          }}
          aria-label="사진 추가"
        >
          <Plus className="size-8" strokeWidth={2.2} />
        </button>

        {Array.from({ length: photoCount }).map((_, index) => (
          <div
            key={`${receiptId}-photo-${index}`}
            className="photo-checker relative h-[60px] w-[72px] shrink-0 rounded-[5px] border"
            style={{ borderColor: index === 0 ? colors.point : colors.border }}
          >
            <button
              type="button"
              className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full"
              style={{ backgroundColor: colors.border, color: colors.darkBackground }}
              aria-label="사진 제거"
            >
              <X className="size-4" strokeWidth={2.1} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhotoPicker;
