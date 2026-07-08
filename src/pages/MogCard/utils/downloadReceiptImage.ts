import { toBlob } from 'html-to-image';

const MAX_DESKTOP_IMAGE_PIXEL_RATIO = 2;
const MAX_MOBILE_IMAGE_PIXEL_RATIO = 1;

type DownloadReceiptImageResult =
  | { status: 'shared' | 'downloaded' | 'cancelled' }
  | { status: 'preview'; objectUrl: string };
type ShareReceiptImageResult = 'shared' | 'downloaded' | 'cancelled';

export async function downloadReceiptImage(
  receiptElement: HTMLElement,
  fileName: string,
): Promise<DownloadReceiptImageResult> {
  const blob = await createReceiptImageBlob(receiptElement);

  const result = await saveImageBlob(blob, fileName);

  return result;
}

export async function shareReceiptImage(
  receiptElement: HTMLElement,
  fileName: string,
): Promise<ShareReceiptImageResult> {
  const blob = await createReceiptImageBlob(receiptElement);
  const file = new File([blob], fileName, { type: 'image/png' });
  const canShareFile =
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });

  if (!canShareFile || typeof navigator.share !== 'function') {
    triggerDownload(blob, fileName);
    return 'downloaded';
  }

  try {
    await navigator.share({
      files: [file],
      title: fileName,
    });

    return 'shared';
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return 'cancelled';
    }

    throw error;
  }
}

async function createReceiptImageBlob(
  receiptElement: HTMLElement,
) {
  await document.fonts?.ready;

  const blob = await toBlob(receiptElement, {
    cacheBust: false,
    pixelRatio: getReceiptImagePixelRatio(),
  });

  if (!blob) {
    throw new Error('영수증 이미지 파일을 만들 수 없습니다.');
  }

  return blob;
}

async function saveImageBlob(
  blob: Blob,
  fileName: string,
): Promise<DownloadReceiptImageResult> {
  const file = new File([blob], fileName, { type: 'image/png' });
  const canShareFile =
    typeof navigator.canShare === 'function' &&
    navigator.canShare({ files: [file] });

  if (isAppleMobileDevice() && canShareFile) {
    try {
      await navigator.share({
        files: [file],
        title: fileName,
      });
      return { status: 'shared' };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { status: 'cancelled' };
      }

      return { status: 'preview', objectUrl: URL.createObjectURL(blob) };
    }
  }

  if (isAppleMobileDevice()) {
    return { status: 'preview', objectUrl: URL.createObjectURL(blob) };
  }

  triggerDownload(blob, fileName);
  return { status: 'downloaded' };
}

function triggerDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

function isAppleMobileDevice() {
  const platform = navigator.platform.toLowerCase();

  return (
    /iphone|ipad|ipod/.test(platform) ||
    (platform === 'macintel' && navigator.maxTouchPoints > 1)
  );
}

function getReceiptImagePixelRatio() {
  const devicePixelRatio = window.devicePixelRatio || 1;
  const maxPixelRatio = isAppleMobileDevice()
    ? MAX_MOBILE_IMAGE_PIXEL_RATIO
    : MAX_DESKTOP_IMAGE_PIXEL_RATIO;

  return Math.min(devicePixelRatio, maxPixelRatio);
}
