import { Plus, X } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from 'react';
import useWheelScrollSensitivity from '@/pages/MeetRecord/hooks/useWheelScrollSensitivity';
import type { RoomRecordPhoto } from '@/types/records';
import { colors } from '../../../constants/colors';
import { typography } from '../../../constants/typography';

const MAX_PHOTO_COUNT = 3;
const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp';

type SelectedPhoto = {
  id: string;
  name: string;
  isWidthCapped?: boolean;
  url?: string;
};

type PhotoPickerProps = {
  photos: RoomRecordPhoto[];
  onUploadPhotos: (files: File[]) => Promise<void>;
  onDeletePhoto: (photoId: number) => Promise<void>;
};

function PhotoPicker({
  photos,
  onUploadPhotos,
  onDeletePhoto,
}: PhotoPickerProps) {
  const fileInputId = useId();
  const photoIdRef = useRef(0);
  const photoUrlsRef = useRef<Set<string>>(new Set());
  const photoScrollRef = useWheelScrollSensitivity<HTMLDivElement>('x');
  const [pendingPhotos, setPendingPhotos] = useState<SelectedPhoto[]>([]);
  const [deletingPhotoId, setDeletingPhotoId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const isPhotoLimitReached = photos.length + pendingPhotos.length >= MAX_PHOTO_COUNT;

  useEffect(() => {
    const photoUrls = photoUrlsRef.current;

    return () => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
      photoUrls.clear();
    };
  }, []);

  const handlePhotoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingCount = MAX_PHOTO_COUNT - photos.length;
    const filesToUpload = selectedFiles.slice(0, remainingCount);

    if (filesToUpload.length === 0) {
      setPhotoError('사진은 최대 3장까지 업로드할 수 있습니다.');
      return;
    }

    const nextPhotos = filesToUpload.map((file) => {
      photoIdRef.current += 1;
      const url = URL.createObjectURL(file);
      photoUrlsRef.current.add(url);

      return {
        id: `room-selected-photo-${photoIdRef.current}`,
        name: file.name,
        url,
      };
    });

    setPendingPhotos(nextPhotos);
    setPhotoError(null);
    setIsUploading(true);

    try {
      await onUploadPhotos(filesToUpload);
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : '사진 업로드 중 오류가 발생했습니다.',
      );
    } finally {
      nextPhotos.forEach((photo) => {
        if (photo.url) {
          URL.revokeObjectURL(photo.url);
          photoUrlsRef.current.delete(photo.url);
        }
      });
      setPendingPhotos([]);
      setIsUploading(false);
    }
  };

  const handlePhotoRemove = async (photoId: number) => {
    setDeletingPhotoId(photoId);
    setPhotoError(null);

    try {
      await onDeletePhoto(photoId);
    } catch (error) {
      setPhotoError(
        error instanceof Error ? error.message : '사진 삭제 중 오류가 발생했습니다.',
      );
    } finally {
      setDeletingPhotoId(null);
    }
  };

  const handlePhotoLoad = (
    photoId: string,
    event: SyntheticEvent<HTMLImageElement>,
  ) => {
    const image = event.currentTarget;
    const renderedWidth = (image.naturalWidth / image.naturalHeight) * 60;
    const shouldCapWidth = renderedWidth > 72;

    setPendingPhotos((currentPhotos) =>
      currentPhotos.map((photo) =>
        photo.id === photoId && photo.isWidthCapped !== shouldCapWidth
          ? { ...photo, isWidthCapped: shouldCapWidth }
          : photo,
      ),
    );
  };

  return (
    <div className="px-2">
      <div className="flex items-center justify-between">
        <h3 className={typography.body} style={{ color: colors.text }}>
          약속 사진
        </h3>
        <p className={typography.caption} style={{ color: colors.border }}>
          전체 최대 3장
        </p>
      </div>

      <input
        id={fileInputId}
        type="file"
        className="sr-only"
        accept={ACCEPTED_IMAGE_TYPES}
        multiple
        disabled={isPhotoLimitReached || isUploading}
        onChange={handlePhotoSelect}
      />

      <div
        ref={photoScrollRef}
        className="mt-5 flex gap-4 overflow-x-auto pb-1 pt-2 promise-scrollbar-hidden"
      >
        <label
          htmlFor={fileInputId}
          className={`flex h-[60px] w-[50px] shrink-0 flex-col items-center justify-center gap-1 rounded-[5px] border ${
            isPhotoLimitReached || isUploading
              ? 'cursor-not-allowed opacity-60'
              : 'cursor-pointer'
          }`}
          style={{
            borderColor: colors.border,
            backgroundColor: colors.darkBackground,
            color: colors.border,
          }}
          aria-label="사진 추가"
          aria-disabled={isPhotoLimitReached || isUploading}
        >
          <Plus className="size-5" strokeWidth={2.2} />
        </label>

        {photos.map((photo, index) => (
          <div
            key={photo.photoId}
            className="photo-checker relative h-[60px] w-[72px] shrink-0 overflow-visible rounded-[5px] border"
            style={{
              borderColor: index === 0 ? colors.point : colors.border,
              opacity: deletingPhotoId === photo.photoId ? 0.6 : 1,
            }}
          >
            <div className="h-[60px] w-[72px] overflow-hidden rounded-[4px]">
              <img
                src={photo.s3Url}
                alt={`선택된 사진 ${index + 1}`}
                className="h-[60px] w-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full"
              style={{ backgroundColor: colors.border, color: colors.darkBackground }}
              aria-label="사진 제거"
              disabled={deletingPhotoId === photo.photoId}
              onClick={() => handlePhotoRemove(photo.photoId)}
            >
              <X className="size-4" strokeWidth={2.1} />
            </button>
          </div>
        ))}

        {pendingPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`photo-checker relative h-[60px] shrink-0 overflow-visible rounded-[5px] border ${
              photo.url && !photo.isWidthCapped ? '' : 'w-[72px]'
            }`}
            style={{
              borderColor: photos.length + index === 0 ? colors.point : colors.border,
              opacity: 0.6,
            }}
          >
            {photo.url ? (
              <div
                className={`h-[60px] overflow-hidden rounded-[4px] ${
                  photo.isWidthCapped ? 'w-[72px]' : 'inline-block'
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className={`h-[60px] w-auto max-w-none object-contain ${
                    photo.isWidthCapped ? 'relative left-1/2 -translate-x-1/2' : ''
                  }`}
                  onLoad={(event) => handlePhotoLoad(photo.id, event)}
                />
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {photoError ? (
        <p className={`${typography.caption} mt-2`} style={{ color: colors.alert }}>
          {photoError}
        </p>
      ) : null}
    </div>
  );
}

export default PhotoPicker;
