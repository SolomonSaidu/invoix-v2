import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createBrandPNG(size) {
  const width = size;
  const height = size;

  // Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrChunk = createChunk('IHDR', ihdrData);

  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowLength);

  // Palette
  const bgR = 79, bgG = 70, bgB = 229;       // #4f46e5 (Brand Indigo)
  const whiteR = 255, whiteG = 255, whiteB = 255;
  const cyanR = 56, cyanG = 189, cyanB = 248; // #38bdf8 (Cyan Accent)

  const radius = size * 0.22; // Rounded app icon corner radius

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // 1. Check if inside rounded app background
      let inAppIcon = false;
      const dx = Math.max(0, Math.max(radius - x, x - (width - radius)));
      const dy = Math.max(0, Math.max(radius - y, y - (height - radius)));
      if (dx * dx + dy * dy <= radius * radius) {
        inAppIcon = true;
      }

      if (!inAppIcon) {
        // Transparent outside rounded icon
        rawData[pixelOffset] = 0;
        rawData[pixelOffset + 1] = 0;
        rawData[pixelOffset + 2] = 0;
        rawData[pixelOffset + 3] = 0;
        continue;
      }

      // Default to brand background
      let r = bgR, g = bgG, b = bgB, a = 255;

      // Normalize coordinates (0 to 1)
      const nx = x / width;
      const ny = y / height;

      // 2. Draw Receipt / Invoice Paper Shape (Center nx: 0.26 to 0.74, ny: 0.22 to 0.78)
      const paperLeft = 0.26;
      const paperRight = 0.74;
      const paperTop = 0.22;
      const paperBottom = 0.78;
      const paperRadius = 0.06;

      const pDx = Math.max(0, Math.max((paperLeft + paperRadius) - nx, nx - (paperRight - paperRadius)));
      const pDy = Math.max(0, Math.max((paperTop + paperRadius) - ny, ny - (paperBottom - paperRadius)));

      const inPaper = (nx >= paperLeft && nx <= paperRight && ny >= paperTop && ny <= paperBottom) &&
                      (pDx * pDx + pDy * pDy <= paperRadius * paperRadius);

      if (inPaper) {
        // White paper background
        r = 248;
        g = 250;
        b = 252; // #f8fafc

        // 3. Draw Invoice Lines inside paper
        // Line 1: ny ~ 0.35, nx from 0.35 to 0.65
        const inLine1 = (ny >= 0.33 && ny <= 0.38) && (nx >= 0.34 && nx <= 0.66);
        // Line 2: ny ~ 0.45, nx from 0.35 to 0.65
        const inLine2 = (ny >= 0.43 && ny <= 0.48) && (nx >= 0.34 && nx <= 0.66);
        // Line 3: ny ~ 0.55, nx from 0.35 to 0.52
        const inLine3 = (ny >= 0.53 && ny <= 0.58) && (nx >= 0.34 && nx <= 0.52);

        if (inLine1 || inLine2 || inLine3) {
          r = 79;
          g = 70;
          b = 229; // Indigo line color
        }
      }

      // 4. Draw Cyan Accent Badge in bottom right of paper (center at nx: 0.68, ny: 0.68, radius: 0.12)
      const badgeCx = 0.68;
      const badgeCy = 0.68;
      const badgeRadius = 0.11;

      const bDistSq = (nx - badgeCx) * (nx - badgeCx) + (ny - badgeCy) * (ny - badgeCy);
      if (bDistSq <= badgeRadius * badgeRadius) {
        r = cyanR;
        g = cyanG;
        b = cyanB;

        // Subtle checkmark dot / mini center icon
        const dotDistSq = (nx - badgeCx) * (nx - badgeCx) + (ny - badgeCy) * (ny - badgeCy);
        if (dotDistSq <= 0.04 * 0.04) {
          r = whiteR;
          g = whiteG;
          b = whiteB;
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);

  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);

  const crcData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = crc32(crcData);
  buffer.writeUInt32BE(crc, 8 + length);

  return buffer;
}

function crc32(buf) {
  let table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }

  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createBrandPNG(192));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createBrandPNG(512));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createBrandPNG(180));
console.log('High-resolution Invoix brand icons generated successfully in public/ !');
