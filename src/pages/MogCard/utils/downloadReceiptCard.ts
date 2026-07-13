import type { MogReceipt, MogReceiptItem, MogReceiptPlace } from '@/pages/MogCard/types';

type CreateReceiptCardPngBlobOptions = {
  width?: number;
  pixelRatio?: number;
};

const TEXT_COLOR = '#1b1a12';
const TEXT_MUTED_COLOR = 'rgba(27, 26, 18, 0.8)';
const BORDER_COLOR = 'rgba(94, 88, 71, 0.7)';
const PAPER_COLOR = '#f5f0e8';
const POLAROID_PHOTO_PATH =
  'M203.108 26.7579L20.1106 32.1238C19.8711 32.1309 19.6822 32.3956 19.6887 32.7153L21.912 141.901C21.9185 142.221 22.1179 142.474 22.3574 142.467L205.355 137.102C205.595 137.094 205.784 136.83 205.777 136.51L203.554 27.3239C203.547 27.0043 203.348 26.7509 203.108 26.7579Z';

const font = {
  logo: '"Noto Serif KR", serif',
  body: '"Pretendard Variable", sans-serif',
  mono: '"DM Mono", monospace',
  barcode: '"Libre Barcode 39 Extended Text", monospace',
};

export async function createReceiptCardPngBlob(
  receipt: MogReceipt,
  { width = 398, pixelRatio = 2 }: CreateReceiptCardPngBlobOptions = {},
) {
  await document.fonts?.ready;

  const layout = measureReceipt(receipt, width);
  const canvas = document.createElement('canvas');
  canvas.width = layout.width * pixelRatio;
  canvas.height = layout.height * pixelRatio;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('이미지를 만들 수 없습니다.');
  }

  context.scale(pixelRatio, pixelRatio);
  context.textBaseline = 'top';

  drawCardBackground(context, layout.width, layout.height);
  await drawReceiptContent(context, receipt, layout);

  return canvasToBlob(canvas);
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function measureReceipt(receipt: MogReceipt, width: number) {
  const contentWidth = width - 60;
  const placeNameWidth = contentWidth - 112;
  const addressWidth = contentWidth - 112;
  const itemNameWidth = contentWidth - 38 - 96;
  let contentHeight = 124 + 58 + 58 + 32;

  contentHeight += 1 + 24;
  receipt.places.forEach((place, index) => {
    contentHeight += measureWrappedText(place.placeName, 15, placeNameWidth).length * 18;
    contentHeight += 4 + measureWrappedText(place.address, 11, addressWidth).length * 15;
    contentHeight += 16;
    contentHeight += place.items.reduce(
      (height, item) =>
        height + Math.max(16, measureWrappedText(item.name, 12, itemNameWidth).length * 16) + 6,
      0,
    );

    if (index < receipt.places.length - 1) {
      contentHeight += 48;
    }
  });

  const polaroidHeight = receipt.representativePhotoUrl ? 177 + 56 : 0;
  contentHeight +=
    24 + 1 + 24 + 18 + 24 + 1 + 5 + 1 + 56 + polaroidHeight + 15 + 40 + 45 + 80 + 48 + 12;

  return {
    width,
    height: Math.max(980, Math.ceil(contentHeight + 132)),
    contentWidth,
    x: 30,
  };
}

async function drawReceiptContent(
  context: CanvasRenderingContext2D,
  receipt: MogReceipt,
  layout: ReturnType<typeof measureReceipt>,
) {
  await drawStamp(context, layout.width - 168, 34);

  let y = 124;
  drawCenteredText(context, receipt.title, layout.width / 2, y, {
    size: 58,
    lineHeight: 58,
    weight: 900,
    family: font.logo,
  });

  y += 116;
  context.fillStyle = TEXT_COLOR;
  context.font = `500 13px ${font.mono}`;
  fillTextLines(context, [`인원 : ${receipt.participantCount}`, receipt.participants], layout.x, y, 20);
  y += 56;
  context.fillText(receipt.datetime, layout.x, y);
  y += 52;

  drawDivider(context, layout.x, y, layout.contentWidth);
  y += 25;
  y = drawPlaces(context, receipt.places, layout, y);
  y += 24;

  drawDivider(context, layout.x, y, layout.contentWidth);
  y += 25;
  drawTotal(context, receipt.totalCost, layout, y);
  y += 42;
  drawDivider(context, layout.x, y, layout.contentWidth);
  y += 6;
  drawDivider(context, layout.x, y, layout.contentWidth);
  y += 57;

  if (receipt.representativePhotoUrl) {
    await drawPolaroid(context, receipt.representativePhotoUrl, layout.width / 2 - 123, y);
    y += 233;
  }

  drawCenteredText(context, receipt.footer, layout.width / 2, y, {
    size: 12,
    lineHeight: 15,
    weight: 500,
    family: font.mono,
    color: TEXT_MUTED_COLOR,
  });
  y += 55;
  drawCenteredText(context, 'MOG', layout.width / 2, y, {
    size: 45,
    lineHeight: 45,
    weight: 900,
    family: font.logo,
  });
  y += 125;
  drawCenteredText(context, receipt.barcodeValue, layout.width / 2, y, {
    size: 48,
    lineHeight: 42,
    weight: 500,
    family: font.barcode,
  });
}

function drawPlaces(
  context: CanvasRenderingContext2D,
  places: MogReceiptPlace[],
  layout: ReturnType<typeof measureReceipt>,
  startY: number,
) {
  let y = startY;
  const amountX = layout.x + layout.contentWidth;
  const textWidth = layout.contentWidth - 112;

  places.forEach((place, index) => {
    context.fillStyle = TEXT_COLOR;
    context.font = `600 15px ${font.body}`;
    const nameLines = wrapText(context, place.placeName, textWidth);
    fillTextLines(context, nameLines, layout.x, y, 18);

    context.font = `600 13px ${font.mono}`;
    context.textAlign = 'right';
    context.fillText(place.totalCost, amountX, y + 1);
    context.textAlign = 'left';

    y += nameLines.length * 18 + 4;
    context.fillStyle = TEXT_MUTED_COLOR;
    context.font = `500 11px ${font.mono}`;
    const addressLines = wrapText(context, place.address, textWidth);
    fillTextLines(context, addressLines, layout.x, y, 15);
    y += addressLines.length * 15 + 16;

    y = drawItems(context, place.items, layout, y);

    if (index < places.length - 1) {
      y += 24;
      drawDottedDivider(context, layout.x, y, layout.contentWidth);
      y += 26;
    }
  });

  return y;
}

function drawItems(
  context: CanvasRenderingContext2D,
  items: MogReceiptItem[],
  layout: ReturnType<typeof measureReceipt>,
  startY: number,
) {
  let y = startY;
  const itemX = layout.x + 38;
  const amountX = layout.x + layout.contentWidth;
  const itemWidth = layout.contentWidth - 38 - 96;

  context.fillStyle = TEXT_COLOR;
  context.font = `500 12px ${font.mono}`;

  items.forEach((item) => {
    const lines = wrapText(context, item.name, itemWidth);
    fillTextLines(context, lines, itemX, y, 16);

    context.textAlign = 'right';
    context.fillText(item.amount, amountX, y);
    context.textAlign = 'left';
    y += Math.max(16, lines.length * 16) + 6;
  });

  return y;
}

function drawTotal(
  context: CanvasRenderingContext2D,
  totalCost: string,
  layout: ReturnType<typeof measureReceipt>,
  y: number,
) {
  context.fillStyle = TEXT_COLOR;
  context.font = `900 15px ${font.body}`;
  context.fillText('Total', layout.x + 2, y);
  context.font = `900 13px ${font.mono}`;
  context.textAlign = 'right';
  context.fillText(totalCost, layout.x + layout.contentWidth - 2, y);
  context.textAlign = 'left';
}

async function drawPolaroid(
  context: CanvasRenderingContext2D,
  photoUrl: string | undefined,
  x: number,
  y: number,
) {
  context.save();
  context.translate(x + 123, y + 88);
  context.rotate((-1 * Math.PI) / 180);
  context.translate(-123, -88);

  context.fillStyle = '#fffaf3';
  context.strokeStyle = '#9c9484';
  context.lineWidth = 1.4;
  roundedRect(context, 6, 16, 214, 148, 3);
  context.fill();
  context.stroke();

  const photo = await loadImageAsDataUrl(photoUrl);
  const photoPath = new Path2D(POLAROID_PHOTO_PATH);
  context.save();
  context.clip(photoPath);

  if (photo) {
    drawImageCover(context, photo, 16, 22, 194, 124);
  } else {
    const gradient = context.createLinearGradient(29, 36, 195, 135);
    gradient.addColorStop(0, '#e8e2d6');
    gradient.addColorStop(0.48, '#fdf7f4');
    gradient.addColorStop(1, '#d8cdbb');
    context.fillStyle = gradient;
    context.fillRect(16, 22, 194, 124);
  }

  context.restore();
  context.strokeStyle = 'rgba(27, 26, 18, 0.22)';
  context.lineWidth = 1.4;
  context.stroke(photoPath);
  context.fillStyle = 'rgba(232, 226, 214, 0.78)';
  context.fill(new Path2D('M64.4212 13.4915L136.596 0.588602L138.333 21.0157L66.1585 33.9186L64.4212 13.4915Z'));

  context.restore();
}

async function drawStamp(context: CanvasRenderingContext2D, x: number, y: number) {
  const stamp = await loadImageAsDataUrl('/assets/mog-stamp.svg');
  if (!stamp) {
    return;
  }

  context.save();
  context.translate(x + 76.5, y + 42);
  context.rotate((30 * Math.PI) / 180);
  context.drawImage(stamp, -76.5, -42, 153, 84);
  context.restore();
}

function drawCardBackground(context: CanvasRenderingContext2D, width: number, height: number) {
  const path = createReceiptPath(width, height);

  context.save();
  context.shadowColor = 'rgba(0, 0, 0, 0.26)';
  context.shadowBlur = 16;
  context.shadowOffsetY = 10;
  context.fillStyle = PAPER_COLOR;
  context.fill(path);
  context.restore();

  context.save();
  context.clip(path);
  context.fillStyle = 'rgba(200, 133, 42, 0.025)';
  context.fillRect(0, 0, width, height);
  context.fillStyle = 'rgba(28, 26, 20, 0.018)';
  context.fillRect(0, 0, 9, height);
  context.fillRect(width - 9, 0, 9, height);
  context.restore();
}

function createReceiptPath(width: number, height: number) {
  const notchCount = 15;
  const notchWidth = (7.8 / 234) * width;
  const notchDepth = (5.9 / 542) * height;
  const notchGap = (width - notchCount * notchWidth) / (notchCount + 1);
  const path = new Path2D();

  path.moveTo(0, 0);
  for (let index = 0; index < notchCount; index += 1) {
    const startX = notchGap + index * (notchWidth + notchGap);
    path.lineTo(startX, 0);
    path.quadraticCurveTo(startX + notchWidth / 2, notchDepth, startX + notchWidth, 0);
  }
  path.lineTo(width, 0);
  path.lineTo(width, height);

  for (let index = notchCount - 1; index >= 0; index -= 1) {
    const startX = notchGap + index * (notchWidth + notchGap);
    path.lineTo(startX + notchWidth, height);
    path.quadraticCurveTo(
      startX + notchWidth / 2,
      height - notchDepth,
      startX,
      height,
    );
  }

  path.lineTo(0, height);
  path.closePath();

  return path;
}

function drawDivider(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  context.strokeStyle = BORDER_COLOR;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(x, y + 0.5);
  context.lineTo(x + width, y + 0.5);
  context.stroke();
}

function drawDottedDivider(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
) {
  context.fillStyle = 'rgba(160, 149, 131, 0.75)';
  for (let dotX = x; dotX <= x + width; dotX += 7) {
    context.beginPath();
    context.arc(dotX, y + 1, 1, 0, Math.PI * 2);
    context.fill();
  }
}

function drawCenteredText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: {
    size: number;
    lineHeight: number;
    weight: number;
    family: string;
    color?: string;
  },
) {
  context.fillStyle = options.color ?? TEXT_COLOR;
  context.font = `${options.weight} ${options.size}px ${options.family}`;
  context.textAlign = 'center';
  context.fillText(text, x, y);
  context.textAlign = 'left';
}

function fillTextLines(
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
) {
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function measureWrappedText(text: string, size: number, width: number) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    return [text];
  }

  context.font = `500 ${size}px ${font.body}`;
  return wrapText(context, text, width);
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (!text) {
    return [''];
  }

  const lines: string[] = [];
  let line = '';

  Array.from(text).forEach((char) => {
    const nextLine = line + char;
    if (line && context.measureText(nextLine).width > maxWidth) {
      lines.push(line);
      line = char;
      return;
    }

    line = nextLine;
  });

  lines.push(line);

  return lines;
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const scaledWidth = image.naturalWidth * scale;
  const scaledHeight = image.naturalHeight * scale;

  context.drawImage(
    image,
    x + (width - scaledWidth) / 2,
    y + (height - scaledHeight) / 2,
    scaledWidth,
    scaledHeight,
  );
}

async function loadImageAsDataUrl(url: string | undefined) {
  if (!url) {
    return null;
  }

  try {
    const dataUrl = url.startsWith('data:') ? url : await imageUrlToDataUrl(url);
    if (!dataUrl) {
      return null;
    }

    return await loadImage(dataUrl);
  } catch {
    return null;
  }
}

async function imageUrlToDataUrl(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }

  const blob = await response.blob();

  return blobToDataUrl(blob);
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('이미지를 불러올 수 없습니다.'));
    image.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      try {
        resolve(dataUrlToBlob(canvas.toDataURL('image/png')));
      } catch {
        reject(new Error('이미지를 저장할 수 없습니다.'));
      }
    }, 'image/png');
  });
}

function dataUrlToBlob(dataUrl: string) {
  const [header, base64Data] = dataUrl.split(',');
  const mimeType = header.match(/data:(.*);base64/)?.[1] ?? 'image/png';
  const binary = window.atob(base64Data);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mimeType });
}
