import { useEffect, useRef, useState } from 'react';
import {
  ArrowRightFromLine,
  List,
  LogOut,
  MoreHorizontal,
  Pencil,
  Plus,
  Share2,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
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
  onJoinGroup: () => void;
  onInviteGroup: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onLeaveGroup: () => void;
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
  onJoinGroup,
  onInviteGroup,
  onEditGroup,
  onDeleteGroup,
  onLeaveGroup,
  onLogout,
}: HomeSidebarProps) {
  const [isRoomListExpanded, setIsRoomListExpanded] = useState(true);
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const groupMenuRef = useRef<HTMLDivElement>(null);

  const canManageGroup = selectedGroupRole === 'LEADER';
  const canLeaveGroup = selectedGroupRole === 'MEMBER';

  useEffect(() => {
    setIsGroupMenuOpen(false);
  }, [selectedGroupId, isOpen]);

  useEffect(() => {
    if (!isGroupMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (groupMenuRef.current?.contains(event.target as Node)) return;
      setIsGroupMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isGroupMenuOpen]);

  if (!isOpen) return null;

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
                  내 그룹
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
                        <div
                          className={cn(
                            'relative flex items-center rounded transition-colors',
                            isSelected && 'bg-dark-background/40 text-point',
                          )}
                        >
                          <button
                            type="button"
                            className={cn(menuItemClass, 'min-w-0 flex-1 rounded pr-1')}
                            onClick={() => onSelectGroup(group.id)}
                          >
                            <span className="truncate pl-[30px]">{group.name}</span>
                          </button>

                          {isSelected ? (
                            <div ref={groupMenuRef} className="relative shrink-0 pr-1">
                              <button
                                type="button"
                                className="inline-flex h-9 w-9 items-center justify-center rounded text-inherit"
                                aria-label={`${group.name} 더보기`}
                                aria-expanded={isGroupMenuOpen}
                                aria-haspopup="menu"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setIsGroupMenuOpen((prev) => !prev);
                                }}
                              >
                                <MoreHorizontal size={16} strokeWidth={2} />
                              </button>

                              {isGroupMenuOpen ? (
                                <div
                                  role="menu"
                                  className="absolute right-0 top-full z-10 mt-1 min-w-[148px] rounded-lg border border-border/50 bg-background py-1 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]"
                                >
                                  <button
                                    type="button"
                                    role="menuitem"
                                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-caption text-text hover:bg-dark-background/30"
                                    onClick={() => {
                                      setIsGroupMenuOpen(false);
                                      onInviteGroup();
                                    }}
                                  >
                                    <Share2 size={14} strokeWidth={2} />
                                    초대 코드 공유
                                  </button>

                                  {canManageGroup ? (
                                    <>
                                      <button
                                        type="button"
                                        role="menuitem"
                                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-caption text-text hover:bg-dark-background/30"
                                        onClick={() => {
                                          setIsGroupMenuOpen(false);
                                          onEditGroup();
                                        }}
                                      >
                                        <Pencil size={14} strokeWidth={2} />
                                        수정
                                      </button>
                                      <button
                                        type="button"
                                        role="menuitem"
                                        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-caption text-alert hover:bg-dark-background/30"
                                        onClick={() => {
                                          setIsGroupMenuOpen(false);
                                          onDeleteGroup();
                                        }}
                                      >
                                        <Trash2 size={14} strokeWidth={2} />
                                        삭제
                                      </button>
                                    </>
                                  ) : null}

                                  {canLeaveGroup ? (
                                    <button
                                      type="button"
                                      role="menuitem"
                                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-caption text-alert hover:bg-dark-background/30"
                                      onClick={() => {
                                        setIsGroupMenuOpen(false);
                                        onLeaveGroup();
                                      }}
                                    >
                                      <ArrowRightFromLine size={14} strokeWidth={2} />
                                      탈퇴
                                    </button>
                                  ) : null}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </li>
                    );
                  })
                )
              ) : null}

              <li>
                <button type="button" className={cn(menuItemClass, 'pt-3')} onClick={onCreateGroup}>
                  <Plus size={14} strokeWidth={2} className="shrink-0" />
                  그룹 만들기
                </button>
              </li>

              <li>
                <button type="button" className={cn(menuItemClass, 'pb-5')} onClick={onJoinGroup}>
                  <UserPlus size={16} strokeWidth={2} className="shrink-0" />
                  코드로 참여
                </button>
              </li>
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
