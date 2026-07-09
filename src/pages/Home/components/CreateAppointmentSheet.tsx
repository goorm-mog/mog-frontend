import { useState, type ReactNode } from 'react';
import { Button } from '@/components/common/Button';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { cn } from '@/lib/utils';
import {
  APPOINTMENT_ICON_OPTIONS,
  DEFAULT_APPOINTMENT_ICON_ID,
  type AppointmentIconId,
} from '@/pages/Home/constants/appointmentIcons';

export type CreateAppointmentFormValues = {
  name: string;
  description: string;
  iconId: AppointmentIconId;
};

type CreateAppointmentSheetProps = {
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (values: CreateAppointmentFormValues) => void;
};

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-body text-text">{label}</span>
      {children}
    </div>
  );
}

function CreateAppointmentSheet({ isLoading = false, onClose, onSubmit }: CreateAppointmentSheetProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIconId, setSelectedIconId] = useState<AppointmentIconId>(
    DEFAULT_APPOINTMENT_ICON_ID,
  );

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit || isLoading) return;

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      iconId: selectedIconId,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-107.5 -translate-x-1/2 flex-col rounded-t-lg border border-border bg-background shadow-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-appointment-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="flex w-full justify-center pt-3 pb-2"
          aria-label="닫기"
        >
          <div className="h-1 w-10 rounded-full bg-dark-border/30" />
        </button>

        <header className="px-6 pb-3">
          <h2 id="create-appointment-title" className="text-body text-text">
            소중한 약속 만들기
          </h2>
        </header>

        <div className="flex max-h-[min(60vh,520px)] flex-col gap-6 overflow-y-auto px-6 pb-6 [scrollbar-color:rgb(160_149_131_/_0.35)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border/35 [&::-webkit-scrollbar-track]:bg-transparent">
          <FormField label="약속 이름">
            <div
              className="flex h-12 items-center rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
              style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
            >
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="약속 이름을 입력하세요"
                className={`${typography.caption} min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#a09583]`}
                style={{ color: colors.text }}
              />
            </div>
          </FormField>

          <FormField label="약속 설명 (선택)">
            <div
              className="flex min-h-24 items-start rounded-[10px] border px-5 py-3"
              style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
            >
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="약속에 대해 설명을 입력하세요 (선택)"
                rows={4}
                className={`${typography.caption} min-h-[68px] w-full resize-none bg-transparent outline-none placeholder:text-[#a09583]`}
                style={{ color: colors.text }}
              />
            </div>
          </FormField>

          <FormField label="아이콘 선택">
            <div className="grid grid-cols-5 gap-3" role="group" aria-label="아이콘 선택">
              {APPOINTMENT_ICON_OPTIONS.map(({ id, label, icon: Icon }) => {
                const isSelected = selectedIconId === id;

                return (
                  <button
                    key={id}
                    type="button"
                    aria-label={`${label} 아이콘`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedIconId(id)}
                    className={cn(
                      'flex aspect-square items-center justify-center rounded-2xl border bg-background transition-colors',
                      isSelected ? 'border-point' : 'border-dark-border/30',
                    )}
                  >
                    <Icon size={20} strokeWidth={1.75} className="text-text" />
                  </button>
                );
              })}
            </div>
          </FormField>
        </div>

        <footer className="flex gap-3 px-6 pb-6 pt-4">
          <Button variant="dark" size="lg" onClick={onClose} disabled={isLoading} className="flex-1">
            취소
          </Button>
          <Button
            variant="point"
            size="lg"
            disabled={!canSubmit || isLoading}
            onClick={handleSubmit}
            className="flex-1"
          >
            {isLoading ? '만드는 중...' : '만들기'}
          </Button>
        </footer>
      </div>
    </div>
  );
}

export default CreateAppointmentSheet;
