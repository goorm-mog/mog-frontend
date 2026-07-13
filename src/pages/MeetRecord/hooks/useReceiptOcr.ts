import { useState } from 'react';
import { analyzeReceiptOcr } from '@/api/records';
import type { ReceiptItem } from '@/pages/MeetRecord/types';
import { normalizeReceiptItemsTotal } from '@/pages/MeetRecord/utils/receipt';

const OCR_ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/gif,image/webp';
const OCR_ALLOWED_IMAGE_TYPES = new Set(OCR_ACCEPTED_IMAGE_TYPES.split(','));
const OCR_MAX_FILE_SIZE = 10 * 1024 * 1024;

type ReceiptOcrResult = {
  storeName: string | null;
  items: ReceiptItem[];
};

type UseReceiptOcrParams = {
  roomId: number;
  onSuccess: (result: ReceiptOcrResult) => void;
};

export function useReceiptOcr({ roomId, onSuccess }: UseReceiptOcrParams) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (image: File) => {
    if (!OCR_ALLOWED_IMAGE_TYPES.has(image.type)) {
      window.alert('jpg, png, gif, webp 형식의 영수증 이미지만 업로드할 수 있습니다.');
      return;
    }

    if (image.size > OCR_MAX_FILE_SIZE) {
      window.alert('영수증 이미지는 10MB 이하로 업로드해주세요.');
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await analyzeReceiptOcr(roomId, image);
      const { storeName, items } = response.data;
      const totalAmount = Number.isFinite(response.data.totalAmount)
        ? Math.max(0, response.data.totalAmount)
        : 0;
      const validItems = items
        .map((item) => ({
          name: item.name.trim(),
          count: item.count && Number.isFinite(item.count) && item.count > 0 ? item.count : 1,
          price: Number.isFinite(item.price) ? Math.max(0, item.price) : 0,
        }))
        .filter((item) => item.name.length > 0);

      if (!storeName && totalAmount === 0 && validItems.length === 0) {
        window.alert('영수증을 인식하지 못했습니다. 다른 사진으로 다시 시도해주세요.');
        return;
      }

      onSuccess({
        storeName,
        items:
          validItems.length > 0
            ? normalizeReceiptItemsTotal(validItems, totalAmount)
            : [{ name: '총액', count: 1, price: totalAmount }],
      });
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : '영수증을 분석하는 중 오류가 발생했습니다.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    acceptedImageTypes: OCR_ACCEPTED_IMAGE_TYPES,
    analyzeImage,
    isAnalyzing,
  };
}
