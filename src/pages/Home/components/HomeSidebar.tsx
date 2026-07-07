import { useState } from 'react';
import { List, LogOut, Pencil, Plus, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GroupRole, HomeGroup } from '@/types/group';

type HomeSidebarProps = {
  isOpen: boolean;
  groups: HomeGroup[];
  selectedGroupId: number | null;
  selectedGroupRole: GroupRole | null;
  isLoading?: boolean;
  onClose: () => void;
  onSelectGroup: (groupId: number) => void;
  onCreateGroup: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onLogout: () => void;
};

const menuItemClass = 'flex w-full items-center gap-3 px-2 py-3 text-left text-body text-text';

function HomeSidebar({
  isOpen,
  groups,
  selectedGroupId,
  selectedGroupRole,
  isLoading = false,
  onClose,
  onSelectGroup,
  onCreateGroup,
  onEditGroup,
  onDeleteGroup,
  onLogout,
}: HomeSidebarProps) {
  const [isRoomListExpanded, setIsRoomListExpanded] = useState(true);

  if (!isOpen) return null;

  const canManageGroup = selectedGroupRole === 'LEADER';

  return (
    <div
      className="fixed inset-0 z-50 left-1/2 w-full min-w-[390px] max-w-[430px] -translate-x-1/2"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/20"
        aria-label="사이드바 닫기"
        onClick={onClose}
      />

      <aside
        className="absolute right-0 top-0 flex h-full w-[288px] flex-col border-l border-border/30 bg-background shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
        role="dialog"
        aria-modal="true"
        aria-label="메뉴"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-1 flex-col px-6 py-10">
          <header className="mb-10 flex items-center justify-between px-2">
            <h2
              className="font-noto-serif font-semibold tracking-[-0.7px] text-text"
              style={{ fontSize: 28, lineHeight: `${28 * 1.2}px` }}
            >
              MOG
            </h2>
            <button
              type="button"
              className="inline-flex items-center justify-center p-1 text-text"
              aria-label="닫기"
              onClick={onClose}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </header>

          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-col gap-2">
              <li>
                <button
                  type="button"
                  className={cn(menuItemClass, 'rounded transition-colors')}
                  aria-expanded={isRoomListExpanded}
                  onClick={() => setIsRoomListExpanded((prev) => !prev)}
                >
                  <List size={18} strokeWidth={2} className="shrink-0" />
                  방 리스트
                </button>
              </li>

              {isRoomListExpanded ? (
                isLoading ? (
                  <li>
                    <p className="px-2 py-3 pl-[30px] text-caption text-dark-border">불러오는 중...</p>
                  </li>
                ) : groups.length === 0 ? (
                  <li>
                    <p className="px-2 py-3 pl-[30px] text-caption text-dark-border">그룹이 없어요</p>
                  </li>
                ) : (
                  groups.map((group) => {
                    const isSelected = selectedGroupId === group.id;

                    return (
                      <li key={group.id}>
                        <button
                          type="button"
                          className={cn(
                            menuItemClass,
                            'rounded transition-colors',
                            isSelected && 'bg-dark-background/40 text-point',
                          )}
                          onClick={() => onSelectGroup(group.id)}
                        >
                          <span className="pl-[30px]">{group.name}</span>
                        </button>
                      </li>
                    );
                  })
                )
              ) : null}

              <li>
                <button type="button" className={cn(menuItemClass, 'pb-5 pt-3')} onClick={onCreateGroup}>
                  <Plus size={14} strokeWidth={2} className="shrink-0" />
                  방 생성하기
                </button>
              </li>

              <li aria-hidden>
                <div className="h-px w-full bg-border/50" />
              </li>

              {canManageGroup ? (
                <>
                  <li>
                    <button
                      type="button"
                      className={cn(menuItemClass, 'pb-3 pt-5')}
                      onClick={onEditGroup}
                    >
                      <Pencil size={18} strokeWidth={2} className="shrink-0" />
                      수정
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className={cn(menuItemClass, 'text-alert')}
                      onClick={onDeleteGroup}
                    >
                      <Trash2 size={16} strokeWidth={2} className="shrink-0" />
                      삭제
                    </button>
                  </li>
                </>
              ) : null}
            </ul>
          </nav>

          <button type="button" className={cn(menuItemClass, 'mt-6')} onClick={onLogout}>
            <LogOut size={18} strokeWidth={2} className="shrink-0" />
            로그아웃
          </button>
        </div>
      </aside>
    </div>
  );
}

export default HomeSidebar;
