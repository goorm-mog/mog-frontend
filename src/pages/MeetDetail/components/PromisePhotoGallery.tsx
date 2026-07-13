import { Image as ImageIcon } from 'lucide-react';
import type { MeetDetailData } from '@/features/meetDetail/types';

type PromisePhotoGalleryProps = {
  photos: MeetDetailData['photos'];
};

function PromisePhotoGallery({ photos }: PromisePhotoGalleryProps) {
  return (
    <article className="shrink-0 rounded-[5px] border border-dark-border bg-background px-[18px] py-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon size={17} strokeWidth={2.1} className="text-point" aria-hidden="true" />
          <h2 className="text-[14px] leading-[17px] font-semibold text-text">약속 사진</h2>
        </div>
        <span className="text-[12px] leading-[15px] font-medium text-dark-border">
          {photos.length}장
        </span>
      </div>

      {photos.length > 0 ? (
        <div className="promise-scrollbar-hidden flex gap-3 overflow-x-auto pb-1">
          {photos.map((photo, index) => (
            <div
              key={photo.photoId}
              className="photo-checker h-[112px] shrink-0 overflow-hidden rounded-[5px] border border-border/70 bg-background"
            >
              <img
                src={photo.s3Url}
                alt={`약속 사진 ${index + 1}`}
                className="h-full w-auto object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid h-[86px] place-items-center rounded-[5px] border border-dashed border-border/80 bg-dark-background/20 px-4 text-center">
          <p className="text-[12px] leading-[18px] text-dark-border">
            아직 등록된 약속 사진이 없습니다.
          </p>
        </div>
      )}
    </article>
  );
}

export default PromisePhotoGallery;
