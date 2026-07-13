import { Pencil, Search } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import type { PlaceSearchResult } from '@/pages/MeetRecord/types';
import { colors } from '../../../constants/colors';

type PlaceFieldProps = {
  placeholder: string;
  query: string;
  places: PlaceSearchResult[];
  isDropdownOpen: boolean;
  hasSelectedPlace: boolean;
  selectedAddress?: string | null;
  isSearching?: boolean;
  errorMessage?: string | null;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onEditPlace: () => void;
  onSelectPlace: (place: PlaceSearchResult) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function PlaceField({
  placeholder,
  query,
  places,
  isDropdownOpen,
  hasSelectedPlace,
  selectedAddress,
  isSearching = false,
  errorMessage,
  onQueryChange,
  onSearch,
  onEditPlace,
  onSelectPlace,
  onKeyDown,
}: PlaceFieldProps) {
  const placeDropdownScrollRef = useWheelScrollSensitivity<HTMLDivElement>();

  return (
    <div className="relative">
      {hasSelectedPlace ? (
        <div>
          <div
            className="flex h-9 items-center justify-between border-b"
            style={{ borderColor: colors.darkBorder }}
          >
            <input
              type="text"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent pl-4 pr-3 font-pretendard text-[16px] leading-[20px] outline-none placeholder:text-[#a09583]"
              style={{ color: colors.text }}
              aria-label="장소 입력"
            />
            <button type="button" onClick={onEditPlace} aria-label="장소 편집">
              <Pencil className="size-5" strokeWidth={2.5} color={colors.text} />
            </button>
          </div>
          {selectedAddress ? (
            <p
              className="mt-1 truncate pl-4 font-pretendard text-[16px] leading-[20px]"
              style={{ color: colors.border }}
            >
              {selectedAddress}
            </p>
          ) : null}
        </div>
      ) : (
        <div
          className="flex h-12 items-center justify-between rounded-[10px] border px-5 shadow-[inset_0_1px_2px_rgba(27,26,18,0.06)]"
          style={{ borderColor: colors.darkBackground, backgroundColor: colors.background }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent pr-3 font-pretendard text-[16px] leading-[20px] outline-none placeholder:text-[#a09583]"
            style={{ color: colors.text }}
            aria-label="장소 검색어"
          />
          <button type="button" onClick={onSearch} aria-label="장소 검색">
            <Search className="size-6" strokeWidth={2.5} color={colors.text} />
          </button>
        </div>
      )}

      {isDropdownOpen ? (
        <div
          ref={placeDropdownScrollRef}
          className={`absolute left-0 right-0 z-20 max-h-[168px] overflow-y-auto rounded-[10px] border py-1 shadow-[0_8px_18px_rgba(27,26,18,0.14)] ${
            hasSelectedPlace ? 'top-[42px]' : 'top-[54px]'
          }`}
          style={{
            borderColor: colors.darkBackground,
            backgroundColor: colors.background,
          }}
        >
          {isSearching ? (
            <p
              className="px-5 py-4 font-pretendard text-[16px] leading-[20px]"
              style={{ color: colors.border }}
            >
              검색 중...
            </p>
          ) : errorMessage ? (
            <p
              className="px-5 py-4 font-pretendard text-[16px] leading-[20px]"
              style={{ color: colors.border }}
            >
              {errorMessage}
            </p>
          ) : places.length > 0 ? (
            places.map((place) => (
              <button
                key={place.id}
                type="button"
                className="block h-[72px] w-full px-5 text-left"
                style={{ color: colors.text }}
                onClick={() => onSelectPlace(place)}
              >
                <span className="block truncate font-pretendard text-[16px] leading-[20px]">
                  {place.name}
                </span>
                <span
                  className="mt-1 block truncate font-pretendard text-[16px] leading-[20px]"
                  style={{ color: colors.border }}
                >
                  {place.address}
                </span>
              </button>
            ))
          ) : (
            <p
              className="px-5 py-4 font-pretendard text-[16px] leading-[20px]"
              style={{ color: colors.border }}
            >
              검색 결과가 없습니다
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

export default PlaceField;
