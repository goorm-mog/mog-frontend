import { Plus, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

const MAX_PHOTO_COUNT = 5;

type SelectedPhoto = {
  id: string;
  name: string;
  url?: string;
};

type PhotoPickerProps = {
  photoCount: number;
  receiptId: string;
};

function PhotoPicker({ photoCount, receiptId }: PhotoPickerProps) {
  const fileInputId = useId();
  const photoIdRef = useRef(0);
  const photoUrlsRef = useRef<Set<string>>(new Set());
  const photoScrollRef = useWheelScrollSensitivity<HTMLDivElement>('x');
  const [photos, setPhotos] = useState<SelectedPhoto[]>(() =>
    Array.from({ length: Math.min(photoCount, MAX_PHOTO_COUNT) }, (_, index) => ({
      id: `${receiptId}-photo-${index}`,
      name: `선택된 사진 ${index + 1}`,
    })),
  );
  const isPhotoLimitReached = photos.length >= MAX_PHOTO_COUNT;

  useEffect(() => {
    const photoUrls = photoUrlsRef.current;

    return () => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
      photoUrls.clear();
    };
  }, []);

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    setPhotos((currentPhotos) => {
      const remainingCount = MAX_PHOTO_COUNT - currentPhotos.length;
      const nextPhotos = selectedFiles.slice(0, remainingCount).map((file) => {
        photoIdRef.current += 1;
        const url = URL.createObjectURL(file);
        photoUrlsRef.current.add(url);

        return {
          id: `${receiptId}-selected-photo-${photoIdRef.current}`,
          name: file.name,
          url,
        };
      });

      return [...currentPhotos, ...nextPhotos];
    });

    event.target.value = '';
  };

  const handlePhotoRemove = (photoId: string) => {
    setPhotos((currentPhotos) => {
      const photoToRemove = currentPhotos.find((photo) => photo.id === photoId);

      if (photoToRemove?.url) {
        URL.revokeObjectURL(photoToRemove.url);
        photoUrlsRef.current.delete(photoToRemove.url);
      }

      return currentPhotos.filter((photo) => photo.id !== photoId);
    });
  };

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

      <input
        id={fileInputId}
        type="file"
        className="sr-only"
        accept="image/*"
        multiple
        disabled={isPhotoLimitReached}
        onChange={handlePhotoSelect}
      />

      <div
        ref={photoScrollRef}
        className="mt-5 flex gap-4 overflow-x-auto pb-1 pt-2 promise-scrollbar-hidden"
      >
        <label
          htmlFor={fileInputId}
          className={`flex h-[60px] w-[50px] shrink-0 flex-col items-center justify-center gap-1 rounded-[5px] border ${
            isPhotoLimitReached ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
          }`}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.darkBackground,
            color: colors.border,
          }}
          aria-label="사진 추가"
          aria-disabled={isPhotoLimitReached}
        >
          <Plus className="size-5" strokeWidth={2.2} />
        </label>

        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="photo-checker relative h-[60px] w-[72px] shrink-0 overflow-visible rounded-[5px] border"
            style={{ borderColor: index === 0 ? colors.point : colors.border }}
          >
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.name}
                className="size-full rounded-[4px] object-cover"
              />
            ) : null}
            <button
              type="button"
              className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full"
              style={{ backgroundColor: colors.border, color: colors.darkBackground }}
              aria-label="사진 제거"
              onClick={() => handlePhotoRemove(photo.id)}
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
