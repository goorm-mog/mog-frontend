import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { X } from 'lucide-react';
import Title from '@/components/common/Title/Title';
import { cn } from '@/lib/utils';
import type { NotificationResponse } from '@/types/notification';

type NotificationListSheetProps = {
  notifications: NotificationResponse[];
  isLoading?: boolean;
  isDeletingAll?: boolean;
  onClose: () => void;
  onDeleteAll?: () => void;
};

const TOP_APP_BAR_HEIGHT = 65;
const DROPDOWN_GAP = 2;

function formatNotificationDate(value: string) {
  return format(new Date(value), 'M월 d일 HH:mm', { locale: ko });
}

function NotificationListSheet({
  notifications,
  isLoading = false,
  isDeletingAll = false,
  onClose,
  onDeleteAll,
}: NotificationListSheetProps) {
  const canDeleteAll = Boolean(onDeleteAll) && notifications.length > 0 && !isLoading;

  return (
    <div
      className="fixed inset-0 z-50 left-1/2 w-full min-w-[390px] max-w-[430px] -translate-x-1/2"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/20"
        aria-label="알림 닫기"
        onClick={onClose}
      />

      <section
        className="absolute right-4 flex w-[min(320px,calc(100%-2rem))] max-h-[min(360px,52dvh)] flex-col overflow-hidden rounded-lg border border-border/30 bg-background shadow-[0px_8px_24px_rgba(0,0,0,0.12)]"
        style={{ top: TOP_APP_BAR_HEIGHT + DROPDOWN_GAP }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-list-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border/30 px-4 py-3">
          <h2 id="notification-list-title" className="text-body text-text">
            알림
          </h2>
          <div className="flex items-center gap-1">
            {canDeleteAll ? (
              <button
                type="button"
                className="px-2 py-1 text-caption text-text disabled:opacity-40"
                disabled={isDeletingAll}
                onClick={onDeleteAll}
              >
                {isDeletingAll ? '삭제 중...' : '모두 삭제'}
              </button>
            ) : null}
            <button
              type="button"
              className="inline-flex items-center justify-center p-1 text-text"
              aria-label="닫기"
              onClick={onClose}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="promise-scrollbar-hidden min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {isLoading ? (
            <p className="py-8 text-center text-caption text-[#4a463f]">알림을 불러오는 중이에요</p>
          ) : notifications.length === 0 ? (
            <p className="py-8 text-center text-caption text-[#4a463f]">받은 알림이 없어요</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {notifications.map((notification) => (
                <li key={notification.notificationId}>
                  <div
                    className={cn(
                      'rounded-md border border-border/30 px-3 py-2.5',
                      !notification.isRead && 'bg-dark-background/40',
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          'mt-2 size-1.5 shrink-0 rounded-full',
                          notification.isRead ? 'invisible' : 'bg-point',
                        )}
                        aria-hidden
                      />
                      <div className="min-w-0 flex-1">
                        <Title
                          title={notification.message}
                          titleClassName="break-words"
                          subtitle={{
                            text: formatNotificationDate(notification.createdAt),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

export default NotificationListSheet;
