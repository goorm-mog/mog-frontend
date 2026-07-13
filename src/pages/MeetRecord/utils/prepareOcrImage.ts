const OCR_UPLOAD_MAX_BYTES = 900 * 1024;
const OCR_UPLOAD_MAX_DIMENSION = 1800;
const MIN_JPEG_QUALITY = 0.55;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('이미지를 불러오지 못했습니다.'));
    };
    image.src = url;
  });
}

function canvasToJpeg(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('이미지를 변환하지 못했습니다.'))),
      'image/jpeg',
      quality,
    );
  });
}

export async function prepareOcrImage(file: File): Promise<File> {
  if (file.size <= OCR_UPLOAD_MAX_BYTES && file.type === 'image/jpeg') return file;

  const image = await loadImage(file);
  const initialScale = Math.min(
    1,
    OCR_UPLOAD_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) throw new Error('이미지를 변환할 수 없는 환경입니다.');

  let width = Math.max(1, Math.round(image.naturalWidth * initialScale));
  let height = Math.max(1, Math.round(image.naturalHeight * initialScale));
  let quality = 0.88;
  let blob: Blob;

  do {
    canvas.width = width;
    canvas.height = height;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    blob = await canvasToJpeg(canvas, quality);

    if (blob.size <= OCR_UPLOAD_MAX_BYTES) break;

    if (quality > MIN_JPEG_QUALITY) {
      quality = Math.max(MIN_JPEG_QUALITY, quality - 0.1);
    } else {
      width = Math.max(1, Math.round(width * 0.8));
      height = Math.max(1, Math.round(height * 0.8));
    }
  } while (width > 800 || height > 800);

  return new File([blob], `${file.name.replace(/\.[^.]+$/, '') || 'receipt'}.jpg`, {
    type: 'image/jpeg',
    lastModified: file.lastModified,
  });
}
