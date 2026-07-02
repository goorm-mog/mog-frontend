import { toBlob } from 'html-to-image';

export async function downloadReceiptImage(
  receiptElement: HTMLElement,
  fileName: string,
  fallbackWindow: Window | null = null,
) {
  await document.fonts?.ready;

  const blob = await toBlob(receiptElement, {
    cacheBust: true,
    pixelRatio: window.devicePixelRatio || 1,
  });

  if (!blob) {
    throw new Error('영수증 이미지 파일을 만들 수 없습니다.');
  }

  await saveImageBlob(blob, fileName, fallbackWindow);
}

export function createReceiptImageFallbackWindow() {
  if (!isAppleMobileDevice()) {
    return null;
  }

  const fallbackWindow = window.open('', '_blank');

  if (fallbackWindow) {
    fallbackWindow.document.title = '영수증 이미지 저장';
    fallbackWindow.document.body.style.margin = '0';
    fallbackWindow.document.body.style.fontFamily = 'sans-serif';
    fallbackWindow.document.body.style.background = '#f8f5ef';
    fallbackWindow.document.body.style.color = '#2c2924';
    fallbackWindow.document.body.textContent = '영수증 이미지를 만들고 있어요.';
  }

  return fallbackWindow;
}

async function saveImageBlob(
  blob: Blob,
  fileName: string,
  fallbackWindow: Window | null,
) {
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
      fallbackWindow?.close();
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        fallbackWindow?.close();
        return;
      }
    }
  }

  if (fallbackWindow && !fallbackWindow.closed) {
    openImagePreview(fallbackWindow, blob, fileName);
    return;
  }

  triggerDownload(blob, fileName);
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

function openImagePreview(
  fallbackWindow: Window,
  blob: Blob,
  fileName: string,
) {
  const objectUrl = URL.createObjectURL(blob);
  fallbackWindow.document.body.innerHTML = '';
  fallbackWindow.document.body.style.margin = '0';
  fallbackWindow.document.body.style.background = '#f8f5ef';
  fallbackWindow.document.body.style.padding = '16px';
  fallbackWindow.document.body.style.boxSizing = 'border-box';
  fallbackWindow.document.body.style.fontFamily = 'sans-serif';
  fallbackWindow.document.body.style.color = '#2c2924';

  const image = fallbackWindow.document.createElement('img');
  image.src = objectUrl;
  image.alt = fileName;
  image.style.display = 'block';
  image.style.width = '100%';
  image.style.height = 'auto';

  const guide = fallbackWindow.document.createElement('p');
  guide.textContent = '이미지를 길게 눌러 저장하세요.';
  guide.style.margin = '0 0 12px';
  guide.style.fontSize = '14px';
  guide.style.lineHeight = '20px';

  fallbackWindow.document.body.append(guide, image);
}
