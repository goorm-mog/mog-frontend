import { toBlob } from 'html-to-image';

const MAX_DESKTOP_IMAGE_PIXEL_RATIO = 2;
const MAX_MOBILE_IMAGE_PIXEL_RATIO = 1;
const TRANSPARENT_IMAGE_PLACEHOLDER =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

type ShareReceiptImageResult = 'shared' | 'downloaded' | 'cancelled';

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
    throw new Error('파일 공유를 지원하지 않는 브라우저입니다.');
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

  try {
    return await captureReceiptElement(receiptElement);
  } catch (error) {
    console.warn('영수증 이미지 생성 재시도: 외부 이미지를 제외합니다.', error);
    return captureReceiptElementWithoutExternalImages(receiptElement);
  }
}

async function captureReceiptElement(receiptElement: HTMLElement) {
  const previousFilter = receiptElement.style.filter;
  receiptElement.style.filter = 'none';

  const blob = await toBlob(receiptElement, {
    cacheBust: true,
    imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER,
    pixelRatio: getReceiptImagePixelRatio(),
    style: {
      filter: 'none',
      boxShadow: 'none',
    },
  }).finally(() => {
    receiptElement.style.filter = previousFilter;
  });

  if (!blob) {
    throw new Error('영수증 이미지 파일을 만들 수 없습니다.');
  }

  return blob;
}

async function captureReceiptElementWithoutExternalImages(receiptElement: HTMLElement) {
  const restoreImages = replaceExternalImages(receiptElement);

  try {
    return await captureReceiptElement(receiptElement);
  } finally {
    restoreImages();
  }
}

function replaceExternalImages(receiptElement: HTMLElement) {
  const htmlImages = [...receiptElement.querySelectorAll<HTMLImageElement>('img')].map(
    (image) => ({
      image,
      src: image.getAttribute('src'),
    }),
  );
  const svgImages = [...receiptElement.querySelectorAll<SVGImageElement>('image')].map(
    (image) => ({
      image,
      href: image.getAttribute('href'),
    }),
  );

  htmlImages.forEach(({ image, src }) => {
    if (src && isExternalImageUrl(src)) {
      image.setAttribute('src', TRANSPARENT_IMAGE_PLACEHOLDER);
    }
  });
  svgImages.forEach(({ image, href }) => {
    if (href && isExternalImageUrl(href)) {
      image.setAttribute('href', TRANSPARENT_IMAGE_PLACEHOLDER);
    }
  });

  return () => {
    htmlImages.forEach(({ image, src }) => {
      if (src === null) {
        image.removeAttribute('src');
      } else {
        image.setAttribute('src', src);
      }
    });
    svgImages.forEach(({ image, href }) => {
      if (href === null) {
        image.removeAttribute('href');
      } else {
        image.setAttribute('href', href);
      }
    });
  };
}

function isExternalImageUrl(value: string) {
  if (value.startsWith('data:') || value.startsWith('/')) {
    return false;
  }

  try {
    return new URL(value, window.location.href).origin !== window.location.origin;
  } catch {
    return false;
  }
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
